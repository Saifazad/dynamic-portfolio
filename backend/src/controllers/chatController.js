const dbService = require('../services/dbService');

const handleChat = async (req, res, next) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Fetch live portfolio context
    const portfolio = await dbService.getPortfolioData();
    const config = portfolio.site_config || {};
    const projects = portfolio.projects || [];
    const skills = portfolio.skills || [];
    const education = portfolio.education || [];
    const experience = portfolio.experience || [];

    // Check if GROQ_API_KEY is available
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your-groq-api-key')) {
      console.warn('⚠️ GROQ_API_KEY is not set or placeholder. Falling back to Mock Keywords Responder.');
      const responseText = getMockResponse(message, portfolio);
      return res.json({ response: responseText, isMock: true });
    }

    // Construct system instructions
    const context = `
You are the professional, friendly, and helpful AI portfolio assistant for Saif, a professional Software Developer specializing in Flutter and Full-Stack development.
Your goal is to answer questions about Saif's skills, experience, education, projects, and contact information based ONLY on the portfolio details provided below.
Provide highly professional, polite, and structured responses. Speak directly to the user (e.g. "Saif has..." or "Saif knows...").

Language & Script Rules:
- ALWAYS match the language and script style of the user. If the user asks in Hinglish (Hindi written in English letters), respond in Hinglish. If they ask in English, respond in English.
- NEVER use Devanagari script (Hindi characters like 'मैं', 'हैं', 'हाँ', 'हूँ', 'है'). Absolutely write all Hinglish responses using Latin/Roman script (English characters). For example, write: "Main Saif ka AI assistant hoon" instead of "मैं सैफ का एआई असिस्टेंट हूँ".
- Keep the Hinglish natural, professional, and friendly.

Respect and Tone Rules:
- ALWAYS refer to Saif with high respect and professional honorifics in Hinglish. Use terms like "unka", "unki", "unse", "unhe" (e.g., "Aap unse contact kar sakte hain", "Unka experience 2+ years ka hai") instead of informal words like "uska", "uski", "usse", "use".
- Maintain a professional corporate assistant tone. Do not discuss AI disclaimers or "gender/pronoun details". Speak directly and confidently about Saif's professional career.

Formatting Rules:
- Use clear bullet points (starting with '-') for lists.
- Use bold markers (like **item**) only for emphasizing key technologies or titles. Do not over-use markdown formatting.
- If the user wants to contact Saif, hire him, send an email, or submit a message/inquiry, explain how to do so and always append the tag '[SHOW_CONTACT_FORM]' at the end of your response.
- If the user asks something outside the scope of Saif's portfolio or professional life, kindly tell them you don't know but suggest they can message Saif directly by appending the tag '[SHOW_CONTACT_FORM]' at the end of your response.


Here is the live portfolio data from Saif's database:
1. SITE CONFIG / HERO SECTION:
- Title: ${config.hero_title || "Hi, I'm Saif."}
- Subtitle: ${config.hero_subtitle || 'Full-Stack Developer'}
- Skills Tags: ${[config.profile_tag_1, config.profile_tag_2, config.profile_tag_3, config.profile_tag_4].filter(Boolean).join(', ')}

2. TECHNICAL SKILLS:
${skills.map(s => `- ${s.name} (${s.category}, Proficiency: ${s.proficiency}%)`).join('\n')}

3. PROJECTS:
${projects.map((p, idx) => `Project ${idx+1}: ${p.title}
  - Description: ${p.description}
  - Tech Stack: ${Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : p.tech_stack}
  - Github: ${p.github_url || 'N/A'}
  - Live Demo: ${p.live_url || 'N/A'}`).join('\n\n')}

4. WORK EXPERIENCE:
${experience.map(exp => `- Role: ${exp.role} at ${exp.company} (${exp.duration})
  Achievements:
  ${Array.isArray(exp.achievements_array) ? exp.achievements_array.map(a => `  * ${a}`).join('\n') : exp.achievements_array}`).join('\n')}

5. EDUCATION:
${education.map(ed => `- ${ed.degree} from ${ed.institution} (${ed.start_year} - ${ed.end_year})
  Details: ${ed.description || 'N/A'}`).join('\n')}

6. CONTACT INFO:
- Email: saifazad000@gmail.com (or via the contact form on this website)
`;

    // Construct OpenAI messages array for Groq
    const messages = [
      { role: 'system', content: context }
    ];

    if (history && Array.isArray(history)) {
      // Keep only last 10 messages to optimize context window
      const cleanHistory = history.slice(-10);
      cleanHistory.forEach(item => {
        messages.push({
          role: item.sender === 'user' ? 'user' : 'assistant',
          content: item.text
        });
      });
    }

    // Add current query
    messages.push({
      role: 'user',
      content: message
    });

    // Make API request to Groq endpoint
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      throw new Error(`Groq API returned ${groqResponse.status}: ${errorText}`);
    }

    const groqData = await groqResponse.json();
    const responseText = groqData.choices?.[0]?.message?.content;

    if (!responseText) {
      throw new Error('Invalid response structure from Groq API');
    }

    return res.json({ response: responseText });
  } catch (err) {
    next(err);
  }
};

// Simple keywords-based response generator when API key is missing
function getMockResponse(message, portfolio) {
  const query = message.toLowerCase();
  const email = portfolio.site_config?.email || 'saifazad000@gmail.com';
  
  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    return "Hi there! I am Saif's AI Assistant. How can I help you learn more about his skills, experience, or projects today? (Note: To enable live AI responses, please set the GROQ_API_KEY in the backend .env file)";
  }
  
  if (query.includes('skill') || query.includes('technolog') || query.includes('language') || query.includes('stack')) {
    const list = portfolio.skills && portfolio.skills.length > 0 ? portfolio.skills.map(s => s.name).join(', ') : '';
    return list 
      ? `Saif specializes in Full-Stack development. His core technical skills include: ${list}.`
      : "You can view Saif's technical skills in the Skills section of this portfolio website.";
  }
  
  if (query.includes('project') || query.includes('work') || query.includes('build')) {
    const list = portfolio.projects && portfolio.projects.length > 0 ? portfolio.projects.map(p => p.title).join(', ') : '';
    return list 
      ? `Saif has worked on several dynamic projects including: ${list}. You can view the details in the Projects section above!`
      : "You can view Saif's dynamic projects in the Projects section of this portfolio website.";
  }
  
  if (query.includes('experience') || query.includes('job') || query.includes('company')) {
    const list = portfolio.experience && portfolio.experience.length > 0 ? portfolio.experience.map(e => `${e.role} at ${e.company}`).join(' and ') : '';
    return list 
      ? `Saif's professional experience includes working as a ${list}.`
      : "You can view Saif's work history and professional experience in the Experience timeline section of this portfolio website.";
  }
  
  if (query.includes('education') || query.includes('college') || query.includes('university') || query.includes('degree')) {
    const list = portfolio.education && portfolio.education.length > 0 ? portfolio.education.map(e => `${e.degree} from ${e.institution}`).join(', ') : '';
    return list 
      ? `Saif holds a ${list}.`
      : "You can view Saif's academic and educational background in the Education timeline section of this portfolio website.";
  }
  
  if (query.includes('contact') || query.includes('email') || query.includes('reach') || query.includes('message')) {
    return `You can get in touch with Saif by filling out the Contact Form at the bottom of this page, or email him at ${email}.`;
  }

  return "I'm Saif's AI Assistant. You can ask me about his skills, projects, work experience, or education! (Tip: Set the GROQ_API_KEY in backend/.env for full AI capabilities).";
}


module.exports = {
  handleChat
};
