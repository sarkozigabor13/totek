"use client";
import { supabase } from "@/utils/supbase/client";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../Modal/Modal";
import players from "../Players/playersData";

type ChronicleSectionProps = {
    matchId: string;
  };

  export default function ChronicleSection({ matchId }: ChronicleSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [isSelectingPlayer, setIsSelectingPlayer] = useState(false);
  const [comment, setComment] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedPlayer) {
    toast.error("Válassz ki egy játékost a kommenthez!");
    return;
  }

  const { data, error } = await supabase
    .from("match_chronicles")
    .insert([
      {
        player_name: selectedPlayer.name,
        player_img: selectedPlayer.img,
        comment,
        match_id: matchId,
      },
    ]);

  if (error) {
    console.error("Hiba a krónika mentésekor:", error);
    toast.error("Nem sikerült elmenteni a krónikát!");
} else {
    console.log("Krónika mentve:", data);
    toast.success("Krónika sikeresen elmentve!");
    setComment("");
    setSelectedPlayer(null);
    setIsModalOpen(false);
  }
};


  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{ cursor: "pointer" }}
        className="bg-primary inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-center text-sm font-medium text-black shadow-2xl"
      >
        Krónika hozzáadása
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Krónika hozzáadása"
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex w-full flex-col gap-4 rounded-lg">
            <div className="rounded-lg bg-black px-4 py-2">
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="text-md w-full border-0 bg-black px-0 text-white placeholder-gray-400 focus:ring-0"
                placeholder="Krónika tartalma..."
                required
                rows={10}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg px-3 py-2">
              <button
                type="submit"
                className="bg-primary inline-flex items-center rounded-lg px-4 py-2.5 text-center text-sm font-medium text-black shadow-2xl"
              >
                Kommentelés
              </button>

              {/* Kommentelő kiválasztása */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSelectingPlayer((prev) => !prev)}
                  className="hover:bg-blacksection inline-flex cursor-pointer items-center justify-center rounded-sm p-2 text-gray-500"
                >
                  {selectedPlayer ? (
                    <Image
                      src={selectedPlayer.img}
                      width={32}
                      height={32}
                      alt={selectedPlayer.name}
                      className="rounded-full"
                    />
                  ) : (
                    <Image
                      src="/images/icon/person.png"
                      width={24}
                      height={24}
                      alt="person"
                    />
                  )}
                </button>

                {/* Játékosválasztó kis panel */}
                {isSelectingPlayer && (
                  <div className="bg-blacksection absolute top-10 right-0 z-50 grid max-h-64 w-48 grid-cols-2 gap-2 overflow-y-auto rounded-lg p-2 shadow-lg">
                    {players.map((player) => (
                      <button
                        key={player.id}
                        type="button"
                        onClick={() => {
                          setSelectedPlayer(player);
                          setIsSelectingPlayer(false);
                        }}
                        className="flex flex-col items-center gap-1 rounded-lg p-2 hover:bg-gray-700"
                      >
                        <Image
                          src={player.img}
                          alt={player.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <span className="text-center text-xs text-white">
                          {player.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
