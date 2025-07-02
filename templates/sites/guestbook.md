# Guestbook page

# General
This site is a guestbook for the users to sign in and generate a unique ticket with AI. The tickes created are stored in the database and can be viewed any of the visitors. Users can chat with the AI to generate the ticket color palette depending on the message they send, focusing on the user's mood, style, or anything that inspires them.

Examples:
- "I'm feeling happy and creative" -> generates a ticket with a happy and creative color palette.
- "I'm feeling sad and nostalgic" -> generates a ticket with a sad and nostalgic color palette.
- "I'm feeling excited and adventurous" -> generates a ticket with an excited and adventurous color palette.
- "I'm feeling relaxed and peaceful" -> generates a ticket with a relaxed and peaceful color palette.
- "I'm feeling energetic and focused" -> generates a ticket with an energetic and focused color palette.
- "I'm feeling creative and inspired" -> generates a ticket with a creative and inspired color palette.
- "I'm feeling nostalgic and reflective" -> generates a ticket with a nostalgic and reflective color palette.

## Tasks
- [ ] Add a check for the auth status of the user from supabase.
- [ ] Implement Vercel AI SDK for the AI generation.
  - [ ] Consider which is the best model to use for this task (cheapest and most accurate).
  - [ ] Generate a prompt for the AI to generate the ticket color palette (background, accent color, etc).
  - [ ] Generate a document with the steps to follow to retrieve the API key for the selected model.
- [ ] Implement the core UI structure of a ticket (background, accent color, etc).
- [ ] Retrieve the user information from supabase to get the avatar, name, and email.
- [ ] Modify the prisma schema to include the guestbook table.
- [ ] Modify the prisma schema to include the ticket table.
- [ ] Generate a unique ID for the ticket with the format `C-000000`. The first letter is fixed to `C` and the rest are numbers depending on the number of tickets created, it's basically a counter to see how many tickets have been created.
- [ ] Implement a minimal UI for the AI chat to generate the ticket color palette.
  - [ ] Add a chat input field.
  - [ ] Add a button to send the message to the AI.
  - [ ] Add a button to clear the chat.
  - [ ] Add a button to generate the ticket color palette.