import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// GET - Fetch user profile
export async function GET() {
  try {
    const session = await auth();
    
    console.log('Profile API - Session:', JSON.stringify(session, null, 2));
    console.log('Profile API - User ID:', session?.user?.id);

    if (!session?.user?.id) {
      console.error('Profile API - No user ID in session');
      return NextResponse.json(
        { error: 'Unauthorized - No user ID in session' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { profile, preferences } = body;

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update profile if provided
    if (profile) {
      console.log('Updating profile with:', JSON.stringify(profile, null, 2));
      
      // Get current profile as plain object
      const currentProfile = user.profile ? JSON.parse(JSON.stringify(user.profile)) : {};
      
      // Merge with new profile data
      const updatedProfile = {
        ...currentProfile,
        ...profile,
      };
      
      console.log('Merged profile:', JSON.stringify(updatedProfile, null, 2));
      
      // Set the profile
      user.set('profile', updatedProfile);
    }

    // Update preferences if provided
    if (preferences) {
      console.log('Updating preferences with:', JSON.stringify(preferences, null, 2));
      
      const currentPreferences = user.preferences ? JSON.parse(JSON.stringify(user.preferences)) : {};
      
      const updatedPreferences = {
        ...currentPreferences,
        emailNotifications: {
          ...(currentPreferences.emailNotifications || {}),
          ...(preferences.emailNotifications || {}),
        },
        smsNotifications: {
          ...(currentPreferences.smsNotifications || {}),
          ...(preferences.smsNotifications || {}),
        },
        pushNotifications: {
          ...(currentPreferences.pushNotifications || {}),
          ...(preferences.pushNotifications || {}),
        },
        privacy: {
          ...(currentPreferences.privacy || {}),
          ...(preferences.privacy || {}),
        },
        eventPreferences: {
          ...(currentPreferences.eventPreferences || {}),
          ...(preferences.eventPreferences || {}),
        },
        language: preferences.language || currentPreferences.language,
        theme: preferences.theme || currentPreferences.theme,
        currency: preferences.currency || currentPreferences.currency,
        timezone: preferences.timezone || currentPreferences.timezone,
      };
      
      user.set('preferences', updatedPreferences);
    }

    console.log('Saving user to database...');
    await user.save();
    console.log('User saved successfully');

    // Return updated user without password
    const updatedUser = await User.findById(session.user.id).select('-password');

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// PATCH - Partial update (for specific sections)
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    await dbConnect();

    const updateData: Record<string, unknown> = {};

    // Handle profile updates
    if (body.profile) {
      Object.keys(body.profile).forEach((key) => {
        updateData[`profile.${key}`] = body.profile[key];
      });
    }

    // Handle preferences updates
    if (body.preferences) {
      Object.keys(body.preferences).forEach((section) => {
        if (typeof body.preferences[section] === 'object' && !Array.isArray(body.preferences[section])) {
          Object.keys(body.preferences[section]).forEach((key) => {
            updateData[`preferences.${section}.${key}`] = body.preferences[section][key];
          });
        } else {
          updateData[`preferences.${section}`] = body.preferences[section];
        }
      });
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}