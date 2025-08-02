import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@web/components/ui/accordion"
import Emoji from "../misc/Emoji"

const items = [
  {
    "id": 1,
    "question": "What is Trekie?",
    "answer": "Trekie is your gamified life dashboard and AI productivity companion. It turns your real-life goals, habits, and tasks into an engaging game where you level up by completing what matters most to you. Powered by an AI assistant that guides and motivates you, Trekie helps you stay on track, build momentum, and make personal growth fun, not a chore."
  },
  {
    "id": 2,
    "question": "How does Trekie work?",
    "answer": "Trekie lets you create commitments (recurring habits) and goals (longer-term achievements). As you complete them, you earn XP, maintain streaks, unlock rewards, and progress your personal journey. The AI companion gives you smart suggestions, productivity hints, and encouragement based on your activity. You can also explore social features, like sharing progress with friends and joining community quests."
  },
  {
    "id": 3,
    "question": "What makes Trekie different from other productivity or gamification apps?",
    "answer": "Most productivity apps are either too serious or too shallow. Trekie balances real personal growth with joyful gamification. Unlike typical habit trackers, Trekie has a built-in AI coach that evolves with you. And unlike superficial gamified apps, Trekie offers deep productivity systems backed by behavioral science, yet presented in a playful, motivating way. It's designed for sustainable motivation, not gimmicks."
  },
  {
    "id": 4,
    "question": "What features are free, and what’s included in Premium?",
    "answer": "Trekie offers a generous free version where you can track commitments, set goals, earn XP, and receive basic AI hints. Premium unlocks advanced features like full AI coaching, personalized productivity plans, deeper gamification layers (badges, power-ups, avatar upgrades), social modes (team quests, leaderboard), habit analytics, and more customization options. Premium also helps support the development of Trekie and keeps the free version sustainable."
  },
  {
    "id": 6,
    "question": "Who is Trekie for?",
    "answer": "Trekie is for anyone who wants to build better habits and achieve their personal or professional goals—whether you're a student, creative, indie hacker, knowledge worker, or lifelong learner. If traditional productivity tools feel too dry, or if you're tired of falling off track after a few weeks, Trekie is built to help you stay engaged in your growth journey over the long term."
  },
  {
    "id": 7,
    "question": "What kind of AI powers Trekie?",
    "answer": "Trekie’s AI companion is built on large language models fine-tuned for productivity coaching, habit formation, and motivation. It doesn’t just chat aimlessly—it gives practical, actionable advice, and personalizes its feedback based on your progress. Over time, we’ll add even smarter context awareness and integrations to make the AI feel like a true life companion."
  },
  {
    "id": 8,
    "question": "Can I use Trekie with my friends or team?",
    "answer": "Yes! Trekie is not just for solo use. You can share your goals with friends, join group quests, and encourage each other on your personal journeys. Future updates will include team productivity modes, social leaderboards, and community challenges to bring collaborative gamification to life."
  },
  {
    "id": 9,
    "question": "What platforms does Trekie support?",
    "answer": "Trekie is currently available as a web app. Native iOS and Android apps are planned in the future. Your progress syncs across devices, so you can check in from anywhere."
  },
  {
    "id": 12,
    "question": "Why did you build Trekie?",
    "answer": "We built Trekie because personal growth shouldn’t feel boring or lonely. We believe productivity and self-improvement work better when they feel like a game you actually enjoy playing, not an obligation you dread. Trekie is our way of making real-life progress joyful, social, and motivating for anyone."
  },
  {
    "id": 10,
    "question": "Is my data safe? How do you handle privacy?",
    "answer": "Privacy and trust are core to Trekie. Your data belongs to you—we don’t sell your personal information. All user data is securely stored and encrypted. You control what you share publicly or with friends. We follow industry best practices for data security and privacy compliance."
  },
  {
    "id": 11,
    "question": "Will Trekie stay ad-free?",
    "answer": "Yes, Trekie is built to be supported by subscriptions, not ads. Our goal is to make an empowering, user-focused tool without distracting ads or manipulative business models. Supporting Premium helps keep the free version sustainable and ad-free."
  }
]

export default function FAQ() {
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Emoji emoji="❓" size={40} />
          <h2 className="text-3xl font-extrabold tracking-tight">FAQs</h2>
        </div>
        <p className="text-lg text-muted-foreground">
          All you might want to know about Trekie.
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        className="-space-y-px mx-2"
        defaultValue="3"
      >
        {items.map((item) => (
          <AccordionItem
            value={item.id.toString()}
            key={item.id}
            className="bg-background has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative border px-4 py-1 outline-none first:rounded-t-md last:rounded-b-md last:border-b has-focus-visible:z-10 has-focus-visible:ring-[3px]">
            <AccordionTrigger className="justify-start gap-3 rounded-md py-2 text-md leading-6 outline-none hover:no-underline focus-visible:ring-0 [&>svg]:-order-1 cursor-pointer">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="dark:text-muted-foreground text-[16px] leading-normal ps-7 pb-2">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
