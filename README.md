# ButlerBot - AI drive-through assistant

## Inspiration

One evening, while out with friends at a Hungry Jacks Drive-through, the inefficiencies and repetitiveness of the human order-taking process became glaringly evident. We thought, “In an age where technology has advanced so far, why are we still relying on manual methods for something as routine as this?” That fleeting thought became the genesis of ButlerBot.

## What it does

ButlerBot is not just another voice assistant; it’s a revolution in the food-ordering space. By integrating seamlessly with a business's Square Account, ButlerBot brings forth the entire menu to the customer, facilitating easy ordering. And that’s not all! Once you finalize your meal choices, the bot initiates the checkout process directly through Square Terminal. No human intervention, no communication breakdowns, just a swift, efficient ordering process. This doesn’t just save time; it redelegates human resources to roles that require creativity and innovation, moving away from the mundane task of noting down orders.

## How we built it

Our journey to build ButlerBot was an intricate interplay of multiple technologies:

- Voice Activity Detector AI: This AI module is our starting point. It keenly listens for user activity, detecting when a customer starts placing their order without the need for any manual initiation.
- Google AI's Speech-to-Text: Once we have the user's voice, this tool transcribes it into text, forming the base for our bot's processing.
- GPT Model Integration: The transcribed text is then fed into a GPT model. This AI powerhouse manages the order's logic and ensures the conversation flows naturally, understanding the context and nuances of each user interaction.
- Google AI's Text-to-Speech: After GPT processes the conversation, Google's AI tool converts the bot's textual response back into human-like speech, played back to the user, creating a seamless communication loop.
- Square's Terminal API: The cherry on the cake! Once an order is ready for payment, this API gets activated, directing the payment procedure straight to the merchant's device.

## Challenges we ran into

Innovation is rarely without its hiccups:

Our first major challenge was with Google's Speech-to-Text. Initially, it often misinterpreted menu items, leading to order inaccuracies. By optimizing for the beta model and specifically training it with menu phrases, we significantly reduced failure rates.

With GPT, we had to rethink our strategy to use GPT functions for each user action, ensuring that the bot's responses were accurate and void of misinterpretations or hallucinations.

## Accomplishments that we're proud of

Building a system that not only streamlines the order-taking process but also potentially reshapes the landscape of drive-throughs and takeouts is an accomplishment in itself. We're particularly proud of integrating such diverse technologies into one cohesive, user-friendly platform.

## What we learned

From understanding voice nuances to optimizing AI responses for real-world applications, the journey of creating ButlerBot was a deep dive into the nuances of AI and user experience. We've garnered invaluable insights into voice recognition, AI training, and seamless application integration.

## What's next for ButlerBot

The horizon is bright for ButlerBot. We're looking at integrating multi-language support, expanding to other payment platforms, and even exploring possibilities outside the food industry. The goal? To make ButlerBot synonymous with efficient, AI-driven customer service.
