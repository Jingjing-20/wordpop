import { createFileRoute } from "@tanstack/react-router";
import { WordPopGame } from "@/components/WordPopGame";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Word Pop" },
      {
        name: "description",
        content:
          "Word Pop is a bright, fast ESL mini-game for kids: hear the English word and pop the balloon with the matching picture.",
      },
      { property: "og:title", content: "Word Pop — ESL Listening Game for Kids" },
      {
        property: "og:description",
        content:
          "Hear the word, pop the matching balloon. A 90-second English vocabulary game for young learners.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen min-h-dvh bg-[image:var(--gradient-page)] py-3 sm:py-6">
      <header className="mx-auto mb-2 sm:mb-4 max-w-5xl px-2 sm:px-4 text-center">
        <h1 className="font-display clamp-title text-foreground">
          🎈 Word Pop <span className="text-primary">ESL</span>
        </h1>
        <p className="font-body clamp-subtitle text-foreground/70 mt-1">
          Listen, look, and pop the right picture!
        </p>
      </header>
      <WordPopGame />
    </main>
  );
}
