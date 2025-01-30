"use client";

import { Smile } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface Props {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker = ({ onEmojiSelect }: Props) => {
  const colorMode = window.localStorage.getItem("theme")
    ? window.localStorage.getItem("theme")
    : null;

  const [pickerOpen, setPickerOpen] = useState(false);

  // Refs to the button and picker elements
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside both the picker and the button
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setPickerOpen(false); // Close the picker
      }
    };

    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup: Remove the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle picker visibility
  const handleTrigger = (e: React.MouseEvent) => {
    e.preventDefault();
    setPickerOpen((prev) => !prev); // Toggle open state
  };

  return (
    <div className="relative flex">
      {/* Emoji Picker Trigger Button */}
      <div
        ref={buttonRef}
        className="dark:text-white hover:text-gray-300"
        onClick={handleTrigger}
      >
        <Smile size={20} />
      </div>

      {/* Emoji Picker */}
      {pickerOpen && (
        <div
          ref={pickerRef}
          className="absolute z-40 -top-[450px] right-0 shadow-lg bg-white dark:bg-gray-800 rounded-lg"
        >
          <Picker
            theme={colorMode}
            data={data}
            onEmojiSelect={(emoji:any) => onEmojiSelect(emoji.native)} // pass the emojies native string
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
