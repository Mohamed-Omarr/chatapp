Simple Chat Application

Description:

-Real-time chat application for messaging between users

-Built to improve skills in system design, full-stack development, and scalable architecture

Features:

-Add and remove friends

-Send, edit, and delete messages

-Send and respond to friendship requests

-Display online/offline status

-Search for friends

-View friends list

-View notifications

Database & Backend:

-Entities: users, friends, notifications, friendship

-Supabase for auth, storage, and real-time updates

Component Architecture:

-Feature-based grouping

-Clear data flow using props, context, and hooks

Optimization & Performance:

-SSR for authenticated pages

-Caching for friends list and profiles

-Debounced search, paginated lists

-Optimistic UI updates

Security & Deployment:

-Centralized Supabase session management

-Protect APIs with server-side session checks and RLS

-Avoid leaking sensitive client data

State Management & Accessibility:

-React Context

-Proper ARIA labels

Tech Stack:

-Next.js (Full Stack)
-Supabase

Lessons Learned / Challenges:

-Client vs Server Supabase usage

-Component architecture with third-party libraries

-SSR vs CSR tradeoffs

-Plan data flow before moving component
