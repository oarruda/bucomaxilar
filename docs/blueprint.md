# **App Name**: Consulta Fácil

## Core Features:

- Customizable Lead Capture Form: A public-facing form on the landing page to collect prospect data including name, phone, email, and custom check-box responses, with its content and fields dynamically configured from the admin panel.
- WhatsApp Redirect & Prefill: Upon form submission, users are automatically redirected to WhatsApp with a pre-filled message containing their submitted data and the doctor's contact number.
- Secure Lead Data Storage: All submitted lead information, including form responses, is securely persisted in a Firestore database.
- Admin Lead Management Dashboard: A secure administrative interface that allows the doctor or their staff to view, filter, and manage all collected leads stored in Firestore.
- Dynamic Landing Page Settings: An administrative module enabling the modification of the landing page's textual content, customization of form fields and questions, and updating of the WhatsApp contact number, with all changes saved in Firestore.
- AI-Powered WhatsApp Reply Tool: Within the admin panel, a tool that suggests personalized initial WhatsApp reply templates for leads, drawing context from the specific information they provided in the custom form fields.
- Admin Panel Authentication: Secure login mechanism for authorized access to the administrative dashboard.

## Style Guidelines:

- Primary brand color: A refined blue (#1F7EAD), evoking trust and professionalism, for headers and important call-to-action elements.
- Background color: A very light, almost imperceptible blue-grey (#F0F3F5), ensuring a clean and serene backdrop for the landing page.
- Accent color: A vibrant yet sophisticated royal blue (#4763EB), used sparingly for highlights, interactive elements, and to draw attention.
- All text (headlines and body) will use 'Inter' (sans-serif), chosen for its modern, neutral, and highly legible appearance suitable for a medical and professional context.
- Utilize a consistent set of clean, simple, and recognizable outline-style icons to enhance user experience, especially for contact methods and form inputs.
- A responsive and minimalist layout for the landing page, ensuring optimal display on all devices, focusing on clarity for the lead capture form. The admin panel will feature a clear, data-centric layout with easy navigation.
- Implement subtle and elegant animations for form submissions, loading states, and state changes within the admin panel, ensuring a smooth and unobtrusive user experience.