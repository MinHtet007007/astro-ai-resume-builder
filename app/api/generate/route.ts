import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Parse the incoming JSON payload from your form
    const { personnel, experiences, educations } = await req.json();

    // Validate incoming data
    if (!personnel || !experiences || !educations) {
      return NextResponse.json(
        { error: "Missing required data in request." },
        { status: 400 }
      );
    }

    // Format work experiences into a readable string
    const experiencesText = experiences
      .map((exp: any) => {
        const startDate = exp.jobStartDate
          ? new Date(exp.jobStartDate).toLocaleDateString()
          : "N/A";
        const endDate = exp.jobEndDate
          ? new Date(exp.jobEndDate).toLocaleDateString()
          : exp.jobStartDate
          ? "Present"
          : "N/A";
        return `${exp.jobTitle} at ${exp.companyName} in ${exp.jobLocation} (${startDate} - ${endDate})`;
      })
      .join("\n");

    // Format education entries into a readable string
    const educationsText = educations
      .map((edu: any) => {
        const gradDate = edu.graduationDate
          ? new Date(edu.graduationDate).toLocaleDateString()
          : "N/A";
        return `${edu.degreeType} in ${edu.fieldOfStudy} from ${edu.institution} (${gradDate}) at ${edu.schoolLocation}`;
      })
      .join("\n");

    // Construct the prompt using the form data
    const prompt = `
      Generate a professional resume and cover letter for the candidate based on the details below.

      **Candidate Information:**
      - **Name:** ${personnel.name}
      - **Contact Information:**
        - Phone: ${personnel.phone}
        - Email: ${personnel.email}
        - Address: ${personnel.address}
      - **Skills:** ${personnel.skills}

      **Work Experience:**
      ${experiencesText}

      **Education:**
      ${educationsText}

      Your tasks:
      1. Create a polished resume that includes:
        - A concise professional summary highlighting the candidate’s key strengths, skills, and experience.
        - A detailed list of work experiences. For each entry, include:
          - Job Title
          - Company Name
          - Location (City, State)
          - Dates (formatted as "Start Date - End Date")
          - A description of responsibilities and achievements (use newline characters (\\n) for line breaks).
        - A detailed list of education entries. For each entry, include:
          - Institution Name
          - Location (City, State)
          - Degree Type
          - Field of Study
          - Graduation Date
        - A list of skills that also basic related skills.

      2. Generate a tailored cover letter that:
        - Highlights the candidate’s strengths and how their skills and experience make them a great fit for potential roles.
        - Uses newline characters (\\n) for formatting.

      **Output Format:**
      Return your response strictly in JSON format matching the structure below. Do not include any additional text, explanations, or markdown formatting outside of the JSON structure:

      {
        "candidate": {
          "name": "Candidate Name",
          "contact": {
            "phone": "Phone Number",
            "email": "Email Address",
            "address": "Candidate Address"
          }
        },
        "resume": {
          "summary": "A concise professional summary that highlights key strengths, skills, work experience, and education.",
          "workExperience": [
            {
              "title": "Job Title",
              "company": "Company Name",
              "location": "City, State",
              "dates": "Start Date - End Date",
              "description": "Detailed description of responsibilities and achievements, using newline characters (\\n) for line breaks."
            }
            // ... more work experience entries
          ],
          "education": [
            {
              "institution": "Institution Name",
              "location": "City, State",
              "degree": "Degree Type",
              "field": "Field of Study",
              "graduationDate": "Graduation Date"
            }
            // ... more education entries
          ],
          "skills": [
            "Skill 1",
            "Skill 2"
            // ... more skills
          ]
        },
        "coverLetter": "A detailed cover letter that addresses the candidate’s strengths and suitability for roles, using newline characters (\\n) for formatting."
      }

      **Important:**
      - Ensure the generated JSON is valid and parsable.
      - Do not include any additional text or commentary outside of the JSON structure.
    `;

    // Call the OpenAI API using the constructed prompt
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "google/gemini-2.0-flash-exp:free", // or use an alternate model if preferred
    });

    const content = completion.choices[0].message.content;

    if (content) {
      try {
        const jsonString = content
          .replace("```json\n", "")
          .replace("```", "")
          .replace(/\\\\n/g, "\\n");
        return NextResponse.json(JSON.parse(jsonString));
      } catch (jsonParseError) {
        console.error("Error parsing JSON:", jsonParseError);
        return NextResponse.json(
          { error: "Failed to parse generated JSON." },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "No content generated from OpenAI." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
