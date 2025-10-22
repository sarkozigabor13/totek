"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/utils/supbase/client";

type Chronicle = {
  id: string;
  player_name: string;
  player_img: string;
  comment: string;
  created_at: string;
};

export default function ChronicleList({ matchId }: { matchId: string }) {
  const [chronicles, setChronicles] = useState<Chronicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;

    const fetchChronicles = async () => {
      const { data, error } = await supabase
        .from("match_chronicles")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Hiba a krónikák lekérésekor:", error);
      } else {
        setChronicles(data);
      }
      setLoading(false);
    };

    fetchChronicles();

    // Real-time frissítés szűréssel
    const subscription = supabase
      .channel(`chronicles_${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT, UPDATE, DELETE mind
          schema: "public",
          table: "match_chronicles",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setChronicles((prev) => [payload.new as Chronicle, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setChronicles((prev) =>
              prev.map((ch) =>
                ch.id === payload.new.id ? (payload.new as Chronicle) : ch,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setChronicles((prev) =>
              prev.filter((ch) => ch.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [matchId]);

  if (loading) return <p className="text-gray-400">Betöltés...</p>;
  if (chronicles.length === 0)
    return (
      <div
        className="dark:bg-blacksection mb-2 flex items-center rounded-lg bg-red-50 p-2.5 text-lg text-red-800 lg:mb-4 dark:text-red-400"
        role="alert"
      >
        <svg
          className="me-3 inline h-4 w-4 shrink-0"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <div>Még nincs krónika ehhez a meccshez.</div>
      </div>
    );

  return (
    <div className="mb-6 space-y-4">
      {chronicles.map((chronicle) => (
        <div
          key={chronicle.id}
          className="bg-blacksection flex items-start gap-4 rounded-lg border border-gray-700 p-4 shadow"
        >
          <Image
            src={chronicle.player_img}
            alt={chronicle.player_name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-primary font-semibold text-lg">
                {chronicle.player_name}
              </span>
              <span className="text-lg text-gray-500">
                {new Date(chronicle.created_at).toLocaleString("hu-HU")}
              </span>
            </div>
            <p className="mt-1 text-md text-white">{chronicle.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
