import { Poll } from "@/utils/types";

export default function PollPreview({ poll }: { poll: Poll }) {
  return (
    <div
      style={{
        alignItems: "center",
        backgroundSize: "100% 100%",
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        height: "100%",
        justifyContent: "center",
        textAlign: "center",
        width: "100%",
      }}
    >
      <div style={{ display: "flex" }}>
        <img
          key={9}
          style={{ zIndex: 0, width: "102%" }}
          src={`/frames/theme${poll.theme}.png`}
        />
      </div>

      <div
        style={
          poll.theme == 0 || poll.theme == 6
            ? {
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "210px",
                left: "200px",
                width: "800px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }
            : {
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "210px",
                left: "200px",
                width: "800px",
                textWrap: "wrap",
                zIndex: 10,
                color: "white",
                justifyContent: "center",
                textAlign: "center",
              }
        }
      >
        {poll.question}
      </div>
      <div
        style={
          poll.theme == 0 || poll.theme == 6
            ? {
                fontFamily: "fantasy",
                fontSize: "30px",
                position: "absolute",
                top: "418px",
                left: "230px",
                width: "800px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
              }
            : {
                fontFamily: "fantasy",
                fontSize: "30px",
                position: "absolute",
                top: "418px",
                left: "230px",
                width: "800px",
                textWrap: "wrap",
                zIndex: 10,
                color: "white",
              }
        }
      >
        {poll.options[0]}
      </div>
      <div
        style={
          poll.theme == 0 || poll.theme == 6
            ? {
                fontFamily: "fantasy",
                fontSize: "30px",
                position: "absolute",
                top: "418px",
                left: "670px",
                width: "800px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
              }
            : {
                fontFamily: "fantasy",
                fontSize: "30px",
                position: "absolute",
                top: "418px",
                left: "670px",
                width: "800px",
                textWrap: "wrap",
                zIndex: 10,
                color: "white",
              }
        }
      >
        {poll.options[1]}
      </div>
      <div
        style={
          poll.theme == 0 || poll.theme == 6
            ? {
                fontFamily: "fantasy",
                fontSize: "30px",
                position: "absolute",
                top: "535px",
                left: "230px",
                width: "800px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
              }
            : {
                fontFamily: "fantasy",
                fontSize: "30px",
                position: "absolute",
                top: "535px",
                left: "230px",
                width: "800px",
                textWrap: "wrap",
                zIndex: 10,
                color: "white",
              }
        }
      >
        {poll.options[2]}
      </div>
      <div
        style={
          poll.theme == 0 || poll.theme == 6
            ? {
                fontFamily: "fantasy",
                fontSize: "30px",
                position: "absolute",
                top: "535px",
                left: "670px",
                width: "800px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
              }
            : {
                fontFamily: "fantasy",
                fontSize: "30px",
                position: "absolute",
                top: "535px",
                left: "670px",
                width: "800px",
                textWrap: "wrap",
                zIndex: 10,
                color: "white",
              }
        }
      >
        {poll.options[3]}
      </div>
    </div>
  );
}
