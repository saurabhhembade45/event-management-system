const Participant = require("../models/participantsDetails");
const Event = require("../models/events");
const gemini = require("../config/gemini");

const getAIRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get events in which the user has already participated
    const participations = await Participant.find({
      user: userId,
    }).populate("event");

    // Get all available events
    const events = await Event.find().populate("club", "name");

    const previousEvents = participations
      .filter((item) => item.event)
      .map((item) => ({
        id: item.event._id.toString(),
        title: item.event.title,
        description: item.event.description,
      }));

    const availableEvents = events.map((event) => ({
      id: event._id.toString(),
      title: event.title,
      description: event.description,
      club: event.club?.name || "",
    }));

    const prompt = `
You are an event recommendation system.

Based on the student's previous events, recommend the most relevant
upcoming events.

Previous events:
${JSON.stringify(previousEvents)}

Available events:
${JSON.stringify(availableEvents)}

Return ONLY a JSON array containing the IDs of the recommended events.

Example:
["eventId1", "eventId2", "eventId3"]

Rules:
- Do not create new IDs.
- Only use IDs from the available events.
- Recommend events related to the student's previous interests.
- Return only the JSON array.
`;

    // Send recommendation request to Gemini
    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });

    const aiResponse = response.text;

    // Convert Gemini response into JavaScript array
    const recommendedIds = JSON.parse(
      aiResponse.replace(/```json|```/g, "").trim()
    );

    // Get complete event objects from MongoDB
    const recommendedEvents = events.filter((event) =>
      recommendedIds.includes(event._id.toString())
    );

    res.status(200).json({
      success: true,
      events: recommendedEvents,
    });
  } catch (error) {
    console.error("AI Recommendation Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate event recommendations",
    });
  }
};

module.exports = {
  getAIRecommendations,
};