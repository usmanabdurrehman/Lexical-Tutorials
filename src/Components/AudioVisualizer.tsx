import { Flex, IconButton, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { AudioVisualizer } from "react-audio-visualize";
import { Pause, Play } from "react-bootstrap-icons";

export default function AudioVisualizerWrapper() {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  async function createFile() {
    let response = await fetch("/sample_audio.mp3");
    let data = await response.blob();
    let metadata = {
      type: "audio/mp3",
    };
    let file = new File([data], "sample_audio.mp3", metadata);
    setBlob(file);
  }

  useEffect(() => {
    createFile();
  }, []);

  const formattedTime = formatTime(currentTime);

  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div>
      <audio
        ref={audioRef}
        src="/sample_audio.mp3"
        controls
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
      />
      <Flex
        alignItems="center"
        gap={1}
        border="1px solid #ccc"
        padding={1}
        paddingLeft={2}
        paddingRight={2}
        display="inline-flex"
        borderRadius="8px"
      >
        <IconButton
          onClick={() => {
            if (!audioRef.current) return;
            if (isPlaying) {
              audioRef.current.pause();
              setIsPlaying(false);
            } else {
              audioRef.current.play();
              setIsPlaying(true);
            }
          }}
          borderRadius="50%"
          aria-label="Play"
          colorScheme="blue"
          icon={isPlaying ? <Pause /> : <Play />}
          size="xs"
        />
        {blob && (
          <AudioVisualizer
            blob={blob}
            width={100}
            height={50}
            barWidth={1}
            gap={0}
            currentTime={currentTime}
            barPlayedColor={"#336699"}
            barColor="#ddd"
          />
        )}
        <Text fontSize={"x-small"} marginBottom="0px">
          <b>{formattedTime}</b>
        </Text>
      </Flex>
    </div>
  );
}
