const fs = require('fs');

const createTemplate = (name, bgColor, rows) => ({
  counters: { u_column: 5, u_row: 5, u_content_text: 5, u_content_button: 5, u_content_image: 5, u_content_divider: 5 },
  body: {
    id: "body",
    rows: rows,
    values: {
      backgroundColor: bgColor,
      contentWidth: "600px",
      fontFamily: { label: "Helvetica", value: "helvetica,sans-serif" }
    }
  },
  schemaVersion: 15,
  templateName: name
});

const createRow = (bgColor, contents) => ({
  id: `row-${Math.random().toString(36).substring(7)}`,
  cells: [1],
  columns: [{ contents }],
  values: { backgroundColor: bgColor }
});

const templates = [
  {
    id: 'welcome-saas',
    name: 'Welcome Email (Premium SaaS Onboarding)',
    description: 'Clean, modern welcoming email with clear actionable steps.',
    category: 'Welcome',
    thumbnail: 'https://placehold.co/400x500/0f172a/ffffff?text=SaaS+Welcome',
    design: createTemplate('SaaS Welcome', '#f8fafc', [
      createRow('#0f172a', [
        { type: 'image', values: { src: { url: 'https://placehold.co/120x40/0f172a/ffffff?text=SAAS+CO' }, textAlign: 'center', containerPadding: '30px' } }
      ]),
      createRow('#ffffff', [
        { type: 'text', values: { text: '<h1 style="text-align: center; color: #0f172a; font-size: 28px;">Welcome to Your Workspace</h1><p style="text-align: center; color: #475569; font-size: 16px; line-height: 1.5;">We are thrilled to have you onboard. Let us get you set up and ready to go in minutes.</p>', containerPadding: '40px 30px' } },
        { type: 'button', values: { text: 'Complete Your Profile', href: '{{profile_link}}', align: 'center', backgroundColor: '#3b82f6', borderRadius: '6px', containerPadding: '10px 30px 40px' } }
      ]),
      createRow('#f1f5f9', [
        { type: 'text', values: { text: '<p style="text-align: center; color: #64748b; font-size: 12px;">Need help? Reply to this email or visit our help center.</p>', containerPadding: '20px' } }
      ])
    ])
  },
  {
    id: 'newsletter-editorial',
    name: 'Newsletter (Editorial / Modern Cards)',
    description: 'A beautiful editorial layout for weekly curations and content.',
    category: 'Newsletter',
    thumbnail: 'https://placehold.co/400x500/ffffff/333333?text=Editorial+Weekly',
    design: createTemplate('Editorial Newsletter', '#f4f4f5', [
      createRow('#ffffff', [
        { type: 'text', values: { text: '<h2 style="text-align: center; font-family: Georgia, serif; letter-spacing: 2px;">THE WEEKLY DIGEST</h2>', containerPadding: '30px' } }
      ]),
      createRow('#ffffff', [
        { type: 'image', values: { src: { url: 'https://placehold.co/600x300/e4e4e7/52525b?text=Featured+Article' }, textAlign: 'center', containerPadding: '0' } }
      ]),
      createRow('#ffffff', [
        { type: 'text', values: { text: '<h3 style="font-size: 22px; color: #18181b; margin-bottom: 10px;">The Future of Minimalist Design</h3><p style="color: #52525b; line-height: 1.6;">Explore how stripped-down aesthetics are dominating the digital landscape and why whitespace is your best friend...</p>', containerPadding: '30px' } },
        { type: 'button', values: { text: 'Read the full story →', href: '{{article_link}}', align: 'left', backgroundColor: '#18181b', borderRadius: '0px', containerPadding: '0 30px 40px' } }
      ])
    ])
  },
  {
    id: 'promo-sale',
    name: 'Promo Sale (Bold eCommerce)',
    description: 'High-impact design focused on driving immediate conversions.',
    category: 'Promotion',
    thumbnail: 'https://placehold.co/400x500/ef4444/ffffff?text=Flash+Sale',
    design: createTemplate('Bold Promo', '#ffffff', [
      createRow('#ef4444', [
        { type: 'text', values: { text: '<h1 style="text-align: center; color: #ffffff; font-size: 48px; font-weight: 800; margin-bottom: 0;">FLASH SALE</h1><p style="text-align: center; color: #fee2e2; font-size: 24px; font-weight: bold;">UP TO 50% OFF SITEWIDE</p>', containerPadding: '60px 20px 20px' } },
        { type: 'button', values: { text: 'SHOP THE DEALS', href: '{{shop_link}}', align: 'center', backgroundColor: '#000000', color: '#ffffff', borderRadius: '0px', padding: '15px 40px', containerPadding: '10px 20px 80px' } }
      ]),
      createRow('#ffffff', [
        { type: 'text', values: { text: '<p style="text-align: center; color: #737373;">Use code <strong style="color: #ef4444; font-size: 18px;">BOLD50</strong> at checkout.<br>Valid for 24 hours only.</p>', containerPadding: '40px' } }
      ])
    ])
  },
  {
    id: 'event-invite',
    name: 'Event Invite (Sleek Webinar)',
    description: 'Professional and stylish invitation for digital or physical events.',
    category: 'Event',
    thumbnail: 'https://placehold.co/400x500/171717/d4d4d8?text=Webinar+Invite',
    design: createTemplate('Event Invite', '#000000', [
      createRow('#171717', [
        { type: 'text', values: { text: '<p style="color: #a3a3a3; letter-spacing: 3px; font-size: 12px; text-transform: uppercase;">You are Invited</p><h2 style="color: #ffffff; font-size: 32px; margin-top: 10px;">Mastering Next.js Animations</h2>', containerPadding: '50px 40px 20px' } },
        { type: 'text', values: { text: '<p style="color: #d4d4d8; line-height: 1.6;">Join us for an exclusive 60-minute session detailing advanced animation techniques using Framer Motion and Next.js.</p>', containerPadding: '0 40px 20px' } },
        { type: 'text', values: { text: '<div style="background: #262626; padding: 15px; border-radius: 6px;"><p style="color: #ffffff; margin:0;"><strong>Date:</strong> Thursday, Nov 24<br><strong>Time:</strong> 2:00 PM EST</p></div>', containerPadding: '0 40px 30px' } },
        { type: 'button', values: { text: 'Save My Spot', href: '{{registration_link}}', align: 'left', backgroundColor: '#ffffff', color: '#000000', borderRadius: '4px', padding: '12px 24px', containerPadding: '0 40px 50px' } }
      ])
    ])
  },
  {
    id: 're-engagement',
    name: 'Re-engagement (Persuasive Comeback)',
    description: 'Emotionally driven design to win back inactive users.',
    category: 'Retention',
    thumbnail: 'https://placehold.co/400x500/fdf2f8/db2777?text=We+Miss+You',
    design: createTemplate('Comeback Email', '#f9fafb', [
      createRow('#ffffff', [
        { type: 'image', values: { src: { url: 'https://placehold.co/100x100/fdf2f8/db2777?text=♥' }, textAlign: 'center', containerPadding: '50px 20px 20px' } },
        { type: 'text', values: { text: '<h2 style="text-align: center; color: #111827; font-size: 26px;">We have missed you, {{first_name}}!</h2><p style="text-align: center; color: #4b5563; font-size: 16px; line-height: 1.6;">It has been a while since we last saw you. A lot has changed around here, and we think you will love the new updates we have made.</p>', containerPadding: '10px 40px 30px' } },
        { type: 'button', values: { text: 'See What is New', href: '{{updates_link}}', align: 'center', backgroundColor: '#db2777', color: '#ffffff', borderRadius: '30px', padding: '14px 28px', containerPadding: '10px 20px 50px' } }
      ]),
      createRow('#f3f4f6', [
        { type: 'text', values: { text: '<p style="text-align: center; color: #9ca3af; font-size: 12px;">Here is a 20% discount code just for you: <strong>COMEBACK20</strong></p>', containerPadding: '30px' } }
      ])
    ])
  }
];

fs.writeFileSync('src/lib/data/premade-templates.json', JSON.stringify(templates, null, 2));
console.log('Successfully generated premade templates.');
