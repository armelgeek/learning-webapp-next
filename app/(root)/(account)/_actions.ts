"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from '@/auth';
import type { UpdateProfileInput, UpdateLearningGoalsInput } from '@/features/profile/config/profile.schema';

export async function updateName(data: FormData) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  try {
    const value = data.get("value") as string;
    if (!value || value === session?.user.name) return;
    await auth.api.updateUser({ headers: h, body: { name: value } });
    revalidatePath("/", "layout");
  } catch {}
}

export async function updateAvatar(path: string) {
  const h = await headers();
  try {
    await auth.api.updateUser({ headers: h, body: { image: path } });
    revalidatePath("/", "layout");
  } catch {

  }
}

export async function updateUsername(data: FormData) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  try {
    const value = data.get("value") as string;
    if (!value || value === session?.user.username) return;
    await auth.api.updateUser({ headers: h, body: { username: value } });
    revalidatePath("/", "layout");
  } catch {}
}

export async function updateEmail(data: FormData) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  try {
    const value = data.get("value") as string;
    if (!value || value === session?.user.email) return;
    await auth.api.changeEmail({ headers: h, body: { newEmail: value } });
    revalidatePath("/", "layout");
  } catch {}
}

export async function updatePassword(data: FormData) {
  const h = await headers();
  try {
    const currentPassword = data.get("currentPassword") as string;
    const newPassword = data.get("newPassword") as string;
    await auth.api.changePassword({
      headers: h,
      body: { newPassword: newPassword, currentPassword: currentPassword },
    });
  } catch {}
}

export async function deleteAccount(data: FormData) {
  const h = await headers();
  try {
    const password = data.get("value") as string;
    await auth.api.deleteUser({ headers: h, body: { password } });
    revalidatePath("/", "layout");
  } catch {}
}

// New profile-related actions
export async function updateProfile(data: UpdateProfileInput) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  
  if (!session?.user) {
    throw new Error('Not authenticated');
  }

  try {
    // TODO: Implement database update for extended profile fields
    // For now, we'll just update the basic auth fields
    await auth.api.updateUser({ 
      headers: h, 
      body: { 
        name: data.name,
        // Extended fields would be updated in a separate user_profiles table
        // or additional fields in the users table
      } 
    });
    
    // Here you would typically update the extended profile fields in your database
    // Example:
    // await db.update(users)
    //   .set({
    //     age: data.age,
    //     nativeLanguage: data.nativeLanguage,
    //     targetLanguages: JSON.stringify(data.targetLanguages),
    //     currentLevel: data.currentLevel,
    //     learningGoal: data.learningGoal,
    //     bio: data.bio,
    //     country: data.country,
    //     timezone: data.timezone,
    //   })
    //   .where(eq(users.id, session.user.id));
    
    console.log('Profile update:', data); // Temporary log
    revalidatePath("/profile");
    revalidatePath("/", "layout");
  } catch (error) {
    console.error('Profile update error:', error);
    throw new Error('Failed to update profile');
  }
}

export async function updateLearningGoals(data: UpdateLearningGoalsInput) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  
  if (!session?.user) {
    throw new Error('Not authenticated');
  }

  try {
    // TODO: Implement database update for learning goals
    // This would typically update the user_stats table
    // Example:
    // await db.update(userStats)
    //   .set({
    //     dailyGoal: data.dailyGoal,
    //     weeklyGoal: data.weeklyGoal,
    //   })
    //   .where(eq(userStats.userId, session.user.id));
    
    // And update the extended user profile with the learning goal
    // await db.update(users)
    //   .set({
    //     learningGoal: data.learningGoal,
    //   })
    //   .where(eq(users.id, session.user.id));
    
    console.log('Learning goals update:', data); // Temporary log
    revalidatePath("/profile");
  } catch (error) {
    console.error('Learning goals update error:', error);
    throw new Error('Failed to update learning goals');
  }
}
