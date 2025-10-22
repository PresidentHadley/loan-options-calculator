"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function signUp(formData: {
  email: string;
  password: string;
  companyName: string;
  contactName: string;
  subdomain: string;
}) {
  try {
    // Check if subdomain is already taken
    const existingBroker = await prisma.broker.findUnique({
      where: { subdomain: formData.subdomain.toLowerCase() },
    });

    if (existingBroker) {
      throw new Error("Subdomain is already taken");
    }

    // Create auth user in Supabase
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("User creation failed");

    // Create broker record in database
    const broker = await prisma.broker.create({
      data: {
        authUserId: authData.user.id,
        email: formData.email,
        companyName: formData.companyName,
        contactName: formData.contactName,
        subdomain: formData.subdomain.toLowerCase(),
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      },
    });

    return { success: true, broker, user: authData.user };
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

export async function login(email: string, password: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Update last login timestamp
    if (data.user) {
      await prisma.broker.update({
        where: { authUserId: data.user.id },
        data: { lastLoginAt: new Date() },
      });
    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function loginAndRedirect(email: string, password: string) {
  try {
    const result = await login(email, password);
    redirect("/dashboard");
  } catch (error) {
    console.error("Login and redirect error:", error);
    throw error;
  }
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  redirect("/login");
}

export async function resetPassword(email: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Password update error:", error);
    throw error;
  }
}
