# Testing Guide for Peach Lease Development

## Overview
This guide explains how to test the posting of lease functionality and other features when you cannot sign in due to authentication issues.

## Prerequisites
- Access to Supabase dashboard
- Basic understanding of SQL
- Browser developer tools knowledge

## Testing Housing Ad Posting Without Authentication

### Method 1: Direct Database Insert
1. **Access Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor

2. **Create a Test User Entry**
   ```sql
   -- First, create a test user ID (use a valid UUID)
   INSERT INTO auth.users (id, email, created_at, updated_at, email_confirmed_at)
   VALUES (
     '00000000-0000-0000-0000-000000000001',
     'test@uga.edu',
     now(),
     now(),
     now()
   );

   -- Create corresponding profile
   INSERT INTO public.profiles (user_id, email, university, display_name)
   VALUES (
     '00000000-0000-0000-0000-000000000001',
     'test@uga.edu',
     'University of Georgia',
     'Test User'
   );
   ```

3. **Insert Test Housing Ad**
   ```sql
   INSERT INTO public.housing_ads (
     user_id,
     title,
     description,
     price,
     bedrooms,
     bathrooms,
     university,
     dates_available,
     complex_name,
     amenities
   ) VALUES (
     '00000000-0000-0000-0000-000000000001',
     'Cozy 2BR Apartment Near UGA',
     'Beautiful apartment with updated kitchen and walking distance to campus. Pet friendly and includes utilities.',
     1200,
     2,
     1,
     'University of Georgia',
     'Available January 2024 - July 2024',
     'Campus View Apartments',
     ARRAY['WiFi', 'Parking', 'Pet Friendly', 'Utilities Included']
   );
   ```

### Method 2: Temporary RLS Bypass (For Testing Only)
1. **Temporarily Disable RLS on housing_ads table**
   ```sql
   ALTER TABLE public.housing_ads DISABLE ROW LEVEL SECURITY;
   ```

2. **Test the posting functionality through the UI**
   - Navigate to `/post` in your application
   - Fill out the form normally
   - The ad should post without authentication

3. **Re-enable RLS immediately after testing**
   ```sql
   ALTER TABLE public.housing_ads ENABLE ROW LEVEL SECURITY;
   ```

## Testing Image Upload Functionality

### 1. **Test Image Upload Component**
   - Use the browser's developer tools to bypass authentication checks temporarily
   - Open browser dev tools (F12)
   - Go to Console tab
   - Override the auth state:
   ```javascript
   // Temporary override for testing
   window.localStorage.setItem('supabase.auth.token', JSON.stringify({
     user: { id: '00000000-0000-0000-0000-000000000001' }
   }));
   ```

### 2. **Verify Storage Bucket**
   - Check Supabase Storage dashboard
   - Ensure 'housing-images' bucket exists
   - Verify bucket is public
   - Test upload policies

## Testing Search Functionality

### 1. **Add Test Data**
   ```sql
   -- Add multiple test housing ads with different properties
   INSERT INTO public.housing_ads (
     user_id, title, description, price, bedrooms, bathrooms, 
     university, dates_available, complex_name, amenities
   ) VALUES 
   ('00000000-0000-0000-0000-000000000001', 'Luxury Studio at Georgia Tech', 'Modern studio apartment', 1500, 1, 1, 'Georgia Tech', 'Available Now', 'Tech Square', ARRAY['WiFi', 'Gym']),
   ('00000000-0000-0000-0000-000000000001', 'Shared House Near Emory', '3BR house with shared common areas', 800, 3, 2, 'Emory University', 'Fall 2024', 'Druid Hills', ARRAY['Parking', 'Garden']);
   ```

### 2. **Test Search Parameters**
   - Test university filtering
   - Test price range filtering
   - Test bedroom/bathroom filtering
   - Test keyword search

## Testing Messages Functionality

### 1. **Create Test Conversation**
   ```sql
   -- Create second test user
   INSERT INTO auth.users (id, email, created_at, updated_at, email_confirmed_at)
   VALUES (
     '00000000-0000-0000-0000-000000000002',
     'test2@gatech.edu',
     now(),
     now(),
     now()
   );

   INSERT INTO public.profiles (user_id, email, university, display_name)
   VALUES (
     '00000000-0000-0000-0000-000000000002',
     'test2@gatech.edu',
     'Georgia Tech',
     'Test User 2'
   );

   -- Create conversation
   INSERT INTO public.conversations (
     participant_one_id,
     participant_two_id,
     housing_ad_id
   ) VALUES (
     '00000000-0000-0000-0000-000000000001',
     '00000000-0000-0000-0000-000000000002',
     (SELECT id FROM public.housing_ads LIMIT 1)
   );

   -- Add test messages
   INSERT INTO public.messages (
     from_user_id,
     to_user_id,
     housing_ad_id,
     content
   ) VALUES 
   ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', (SELECT id FROM public.housing_ads LIMIT 1), 'Hi, is this apartment still available?'),
   ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', (SELECT id FROM public.housing_ads LIMIT 1), 'Yes! Would you like to schedule a viewing?');
   ```

## Verifying Email Verification System

### 1. **Check Email Verifications Table**
   ```sql
   SELECT * FROM public.email_verifications 
   ORDER BY created_at DESC;
   ```

### 2. **Test Edge Function Manually**
   - Use Postman or curl to test the verification endpoints
   - Check edge function logs in Supabase dashboard

## Browser Testing Tips

### 1. **Clear State Between Tests**
   ```javascript
   // Clear localStorage
   localStorage.clear();
   
   // Clear sessionStorage
   sessionStorage.clear();
   ```

### 2. **Mock Authentication State**
   ```javascript
   // Temporary auth override for UI testing
   const mockUser = {
     id: '00000000-0000-0000-0000-000000000001',
     email: 'test@uga.edu'
   };
   
   // This is for testing UI components only
   window.mockAuth = mockUser;
   ```

## Cleanup After Testing

### 1. **Remove Test Data**
   ```sql
   -- Remove test housing ads
   DELETE FROM public.housing_ads 
   WHERE user_id IN ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002');

   -- Remove test profiles
   DELETE FROM public.profiles 
   WHERE user_id IN ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002');

   -- Remove test auth users
   DELETE FROM auth.users 
   WHERE id IN ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002');
   ```

### 2. **Reset RLS Policies**
   ```sql
   -- Ensure all RLS policies are enabled
   ALTER TABLE public.housing_ads ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
   ```

## Important Notes

- **Security Warning**: Never disable RLS in production
- **Test Data**: Always clean up test data after testing
- **Authentication**: Fix authentication issues before production deployment
- **Edge Functions**: Monitor edge function logs for debugging
- **Storage**: Verify storage policies work correctly with real authentication

## Next Steps

1. Fix the .edu email verification system
2. Implement proper Microsoft SSO integration
3. Test all functionality with real authentication
4. Deploy with proper security measures in place

This guide should help you test all functionality while working on authentication fixes.