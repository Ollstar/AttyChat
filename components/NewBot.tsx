"use client";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function NewBot() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [botName, setBotName] = useState("");
  const [primer, setPrimer] = useState("");
  const [botQuestions, setBotQuestions] = useState<string[]>([""]);

  const createNewBot = async () => {
    const docRef = await addDoc(collection(db, "bots"), {
      creatorId: session?.user?.email!,
      createdAt: serverTimestamp(),
      botName,
      primer,
      botQuestions,
    });

    router.push(`/bot/${docRef.id}`);
  };

  const addQuestionField = () => {
    setBotQuestions((prevQuestions) => [...prevQuestions, ""]);
  };

  const updateQuestionField = (index: number, value: string) => {
    setBotQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions[index] = value;
      return newQuestions;
    });
  };

  return (
    <div>
      <div
        onClick={() => setShowModal(true)}
        className="chatRow p-2 border border-gray-700"
      >
        <PlusIcon className="h-4 w-4" />
        <h2>New Bot</h2>
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-md shadow-lg p-4">
            <h2 className="text-xl font-medium mb-2">New Bot</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createNewBot();
                setShowModal(false);
              }}
            >
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="botName"
                >
                  Bot Name
                </label>
                <input
                  className="w-full border border-gray-400 p-2 rounded-md"
                  type="text"
                  id="botName"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="primer"
                >
                  Primer
                </label>
                <textarea
                  className="w-full border border-gray-400 p-2 rounded-md"
                  id="primer"
                  value={primer}
                  onChange={(e) => setPrimer(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2 mt-2"
                  htmlFor="botQuestions"
                >
                  Bot Questions
                </label>
                {botQuestions.map((question, index) => (
                  <div key={index} className="mb-2">
                    <input
                      className="w-full border border-gray-400 p-2 rounded-md"
                      type="text"
                      value={question}
                      onChange={(e) =>
                        updateQuestionField(index, e.target.value)
                      }
                      required
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-gray-700 text-white px-4 py-2 rounded-md"
                  onClick={addQuestionField}
                >
                  Add Question
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-md"
                  type="submit"
                >
                  Create
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 ml-2 rounded-md"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewBot;
