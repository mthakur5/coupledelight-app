import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// GET - Search for couples
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    
    // Build query filters
    const query: Record<string, unknown> = {
      accountStatus: 'approved',
      _id: { $ne: session.user.id }, // Exclude current user
    };

    // Location filters
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const country = searchParams.get('country');
    
    if (city) {
      query['profile.city'] = new RegExp(city, 'i');
    }
    if (state) {
      query['profile.state'] = new RegExp(state, 'i');
    }
    if (country) {
      query['profile.country'] = new RegExp(country, 'i');
    }

    // Lifestyle filters
    const lifestyleType = searchParams.get('lifestyleType');
    if (lifestyleType) {
      query['profile.lifestyleType'] = lifestyleType;
    }

    const experienceLevel = searchParams.get('experienceLevel');
    if (experienceLevel) {
      query['profile.experienceLevel'] = experienceLevel;
    }

    // Seeking filters
    const seekingGender = searchParams.get('seekingGender');
    if (seekingGender) {
      query['profile.seekingGender'] = seekingGender;
    }

    // Age range filter
    const minAge = searchParams.get('minAge');
    const maxAge = searchParams.get('maxAge');
    if (minAge || maxAge) {
      const ageQuery: Record<string, unknown> = {};
      if (minAge) ageQuery.$gte = parseInt(minAge);
      if (maxAge) ageQuery.$lte = parseInt(maxAge);
      query['$or'] = [
        { 'profile.partner1Age': ageQuery },
        { 'profile.partner2Age': ageQuery }
      ];
    }

    // Relationship status filter
    const relationshipStatus = searchParams.get('relationshipStatus');
    if (relationshipStatus) {
      query['profile.relationshipStatus'] = relationshipStatus;
    }

    // Looking for filter
    const lookingFor = searchParams.get('lookingFor');
    if (lookingFor) {
      query['profile.lookingFor'] = lookingFor;
    }

    // Meeting preference filter
    const meetingPreference = searchParams.get('meetingPreference');
    if (meetingPreference) {
      query['profile.meetingPreference'] = meetingPreference;
    }

    // Verification filter
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      query['profile.verified'] = true;
    }

    // Body type filter for seeking
    const seekingBodyType = searchParams.get('seekingBodyType');
    if (seekingBodyType) {
      query['profile.seekingBodyTypes'] = seekingBodyType;
    }

    // Kinks/interests filter (contains any of the specified kinks)
    const kinks = searchParams.get('kinks');
    if (kinks) {
      const kinksArray = kinks.split(',').map(k => k.trim());
      query['profile.kinks'] = { $in: kinksArray };
    }

    // Interests filter
    const interests = searchParams.get('interests');
    if (interests) {
      const interestsArray = interests.split(',').map(i => i.trim());
      query['profile.interests'] = { $in: interestsArray };
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Sort options
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Execute query
    const couples = await User.find(query)
      .select('-password -accountStatusNote -approvedBy')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await User.countDocuments(query);

    return NextResponse.json({
      couples,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error searching couples:', error);
    return NextResponse.json(
      { error: 'Failed to search couples' },
      { status: 500 }
    );
  }
}