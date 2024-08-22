/** @jsxImportSource frog/jsx */

import { fetchEntryById, insertData } from "@/utils/supabase";
import getCreatePollSignData from "@/utils/write/helpers/getCreatePollSignData";
import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
type State = {
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  optionsCreated: number;
  theme: number;
  validity: {
    day: number; // Update the type of 'day' property to 'number'
    hours: number;
    minutes: number;
  };
};

const app = new Frog<{ State: State }>({
  title: "Private Poll",
  assetsPath: "/",
  basePath: "/api",
  initialState: {
    question: "",
    options: {
      a: "",
      b: "",
      c: "",
      d: "",
    },
    optionsCreated: 0,
    theme: 0,
    validity: {
      day: 0,
      hours: 0,
      minutes: 0,
    },
  },
  imageOptions: {
    fonts: [{ name: "Krona One", source: "google" }],
  },
});
app.composerAction(
  "/create",
  (c) => {
    process.env.FARCASTER_ID = c.actionData.fid.toString();
    return c.res({
      title: "Priv Cast",
      url: "https://privcast.com/create",
    });
  },
  {
    name: "Priv Cast Composer action",
    description: "Create public polls and vote privately",
    icon: "image",
    imageUrl: "https://privcast.com/logo.png",
  }
);

app.frame("/", (c) => {
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "white",
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
        <img key={2} src="/frames/home.png" />
      </div>
    ),
    intents: [
      <Button action="/createqn">Create 🪄</Button>,
      <Button.Link href="http://privcast.com/">Visit PrivCast</Button.Link>,
    ],
  });
});

// app.frame("/createqn", (c) => {
//   const { deriveState } = c;
//   const state = deriveState((prevState) => {});

//   return c.res({
//     action: "/createop1",
//     image: (
//       <div
//         style={{
//           alignItems: "center",
//           background: "white",
//           backgroundSize: "100% 100%",
//           display: "flex",
//           flexDirection: "column",
//           flexWrap: "nowrap",
//           height: "100%",
//           justifyContent: "center",
//           textAlign: "center",
//           width: "100%",
//         }}
//       >
//         <img key={1} style={{ width: "102%" }} src={`/frames/create1.png`} />
//         <div
//           style={{
//             fontFamily: "fantasy",
//             fontSize: "50px",
//             position: "absolute",
//             top: "210px",
//             left: "200px",
//             width: "800px",
//             textWrap: "wrap",
//             zIndex: 10,
//             color: "black",
//             justifyContent: "center",
//             textAlign: "center",
//           }}
//         >
//           {state.question}
//         </div>
//       </div>
//     ),
//     intents: [
//       <TextInput placeholder="Enter your question" />,
//       <Button.Reset>Back ↩️</Button.Reset>,
//       <Button value="op1">Next ➡️</Button>,
//     ],
//   });
// });

// app.frame("/createop1", (c) => {
//   const { frameData, deriveState } = c;
//   const question = frameData?.inputText;
//   console.log("question 0 ", question);
//   const state = deriveState((previousState) => {
//     if (question?.length != 0 && question != undefined) {
//       console.log("Question is not empty");
//       console.log("question", question);
//       previousState.question = question;
//     } else {
//       console.log("Question is empty");
//     }
//   });
//   if (state.question == "") {
//     return c.res({
//       image: (
//         <div
//           style={{
//             alignItems: "center",
//             background: "white",
//             backgroundSize: "100% 100%",
//             display: "flex",
//             flexDirection: "column",
//             flexWrap: "nowrap",
//             height: "100%",
//             justifyContent: "center",
//             textAlign: "center",
//             width: "100%",
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             <img
//               key={11}
//               style={{ zIndex: 1, width: "102%" }}
//               src={`/frames/create1E.png`}
//             />
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "210px",
//               left: "200px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "red",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             Question Cannot be Empty
//           </div>
//         </div>
//       ),
//       intents: [<Button action="/createqn">Back ↩️</Button>],
//     });
//   } else
//     return c.res({
//       action: "/createop2",
//       image: (
//         <div
//           style={{
//             alignItems: "center",
//             background: "white",
//             backgroundSize: "100% 100%",
//             display: "flex",
//             flexDirection: "column",
//             flexWrap: "nowrap",
//             height: "100%",
//             justifyContent: "center",
//             textAlign: "center",
//             width: "100%",
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             <img
//               key={3}
//               style={{ zIndex: 1, width: "102%" }}
//               src={`/frames/create2.png`}
//             />
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "210px",
//               left: "200px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.question}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.a}
//           </div>
//         </div>
//       ),
//       intents: [
//         <TextInput placeholder="Enter Option A" />,
//         <Button action="/createqn">Back ↩️</Button>,
//         <Button value="op1">Next ➡️</Button>,
//       ],
//     });
// });
// app.frame("/createop2", (c) => {
//   const { frameData, deriveState } = c;
//   const op1 = frameData?.inputText;
//   console.log(op1);
//   const state = deriveState((previousState) => {
//     if (op1 !== undefined) {
//       previousState.options.a = op1;
//       if (previousState.optionsCreated == 0) previousState.optionsCreated = 1;
//     }
//   });
//   if (state.options.a == "") {
//     return c.res({
//       image: (
//         <div
//           style={{
//             alignItems: "center",
//             background: "white",
//             backgroundSize: "100% 100%",
//             display: "flex",
//             flexDirection: "column",
//             flexWrap: "nowrap",
//             height: "100%",
//             justifyContent: "center",
//             textAlign: "center",
//             width: "100%",
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             <img
//               key={11}
//               style={{ zIndex: 1, width: "102%" }}
//               src={`/frames/create2E.png`}
//             />
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "210px",
//               left: "200px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.question}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "red",
//             }}
//           >
//             Enter Option
//           </div>
//         </div>
//       ),
//       intents: [<Button action="/createop1">Back ↩️</Button>],
//     });
//   } else
//     return c.res({
//       action: "/createop3",
//       image: (
//         <div
//           key={2}
//           style={{
//             alignItems: "center",
//             background: "white",
//             backgroundSize: "100% 100%",
//             display: "flex",
//             flexDirection: "column",
//             flexWrap: "nowrap",
//             height: "100%",
//             justifyContent: "center",
//             textAlign: "center",
//             width: "100%",
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             <img
//               key={5}
//               style={{ zIndex: 1, width: "102%" }}
//               src={`/frames/create3.png`}
//             />
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "200px",
//               left: "200px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.question}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.a}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.b}
//           </div>
//         </div>
//       ),
//       intents: [
//         <TextInput placeholder="Enter Option B" />,
//         <Button action="/createop1">Back ↩️</Button>,
//         <Button value="op2">Next ➡️</Button>,
//       ],
//     });
// });
// app.frame("/createop3", (c) => {
//   const { frameData, deriveState } = c;
//   const op2 = frameData?.inputText;
//   console.log(op2);
//   const state = deriveState((previousState) => {
//     if (op2 !== undefined) {
//       previousState.options.b = op2;
//       if (previousState.optionsCreated == 1) previousState.optionsCreated = 2;
//     }
//   });
//   if (state.options.b == "") {
//     return c.res({
//       image: (
//         <div
//           style={{
//             alignItems: "center",
//             background: "white",
//             backgroundSize: "100% 100%",
//             display: "flex",
//             flexDirection: "column",
//             flexWrap: "nowrap",
//             height: "100%",
//             justifyContent: "center",
//             textAlign: "center",
//             width: "100%",
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             <img
//               key={11}
//               style={{ zIndex: 1, width: "102%" }}
//               src={`/frames/create3E.png`}
//             />
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "210px",
//               left: "200px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.question}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.a}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "red",
//             }}
//           >
//             Enter Option
//           </div>
//         </div>
//       ),
//       intents: [<Button action="/createop2">Back ↩️</Button>],
//     });
//   } else
//     return c.res({
//       action: "/createop4",
//       image: (
//         <div
//           style={{
//             alignItems: "center",
//             background: "white",
//             backgroundSize: "100% 100%",
//             display: "flex",
//             flexDirection: "column",
//             flexWrap: "nowrap",
//             height: "100%",
//             justifyContent: "center",
//             textAlign: "center",
//             width: "100%",
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             <img
//               key={7}
//               style={{ zIndex: 1, width: "102%" }}
//               src={`/frames/create4.png`}
//             />
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "200px",
//               left: "200px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.question}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.a}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.b}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.c}
//           </div>
//         </div>
//       ),
//       intents: [
//         <TextInput placeholder="Enter Option C" />,
//         <Button action="/createop2">Back ↩️</Button>,
//         <Button value="op3">Next ➡️</Button>,
//       ],
//     });
// });
// app.frame("/createop4", (c) => {
//   const { frameData, deriveState } = c;
//   const op3 = frameData?.inputText;
//   console.log(op3);
//   const state = deriveState((previousState) => {
//     if (op3 !== undefined) {
//       previousState.options.c = op3;
//       if (previousState.optionsCreated == 2) previousState.optionsCreated = 3;
//     }
//   });
//   if (state.options.c == "") {
//     return c.res({
//       image: (
//         <div
//           style={{
//             alignItems: "center",
//             background: "white",
//             backgroundSize: "100% 100%",
//             display: "flex",
//             flexDirection: "column",
//             flexWrap: "nowrap",
//             height: "100%",
//             justifyContent: "center",
//             textAlign: "center",
//             width: "100%",
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             <img
//               key={11}
//               style={{ zIndex: 1, width: "102%" }}
//               src={`/frames/create4E.png`}
//             />
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "210px",
//               left: "200px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.question}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.a}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.b}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "red",
//             }}
//           >
//             Enter Option
//           </div>
//         </div>
//       ),
//       intents: [<Button action="/createop3">Back ↩️</Button>],
//     });
//   } else
//     return c.res({
//       action: "/chooseday",
//       image: (
//         <div
//           style={{
//             alignItems: "center",
//             background: "white",
//             backgroundSize: "100% 100%",
//             display: "flex",
//             flexDirection: "column",
//             flexWrap: "nowrap",
//             height: "100%",
//             justifyContent: "center",
//             textAlign: "center",
//             width: "100%",
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             <img
//               key={8}
//               style={{ zIndex: 1, width: "102%" }}
//               src={`/frames/create5.png`}
//             />
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "200px",
//               left: "200px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.question}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.a}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.b}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.c}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.d}
//           </div>
//         </div>
//       ),
//       intents: [
//         <TextInput placeholder="Enter Option D" />,
//         <Button action="/createop3">Back ↩️</Button>,
//         <Button>Next ➡️</Button>,
//       ],
//     });
// });
// app.frame("/chooseday", (c) => {
//   const { frameData, deriveState } = c;
//   const op4 = frameData?.inputText;
//   console.log(op4);
//   const state = deriveState((previousState) => {
//     if (op4 != undefined) {
//       previousState.options.d = op4;
//       if (previousState.optionsCreated == 3) previousState.optionsCreated = 4;
//     }
//   });
//   if (state.options.d == "") {
//     return c.res({
//       image: (
//         <div
//           style={{
//             alignItems: "center",
//             background: "white",
//             backgroundSize: "100% 100%",
//             display: "flex",
//             flexDirection: "column",
//             flexWrap: "nowrap",
//             height: "100%",
//             justifyContent: "center",
//             textAlign: "center",
//             width: "100%",
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             <img
//               key={11}
//               style={{ zIndex: 1, width: "102%" }}
//               src={`/frames/create5E.png`}
//             />
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "210px",
//               left: "200px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.question}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.a}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.b}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.c}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "red",
//             }}
//           >
//             Enter Option
//           </div>
//         </div>
//       ),
//       intents: [<Button action="/createop4">Back ↩️</Button>],
//     });
//   } else
//     return c.res({
//       action: "/choosehours",
//       image: (
//         <div
//           style={{
//             alignItems: "center",
//             background: "white",
//             backgroundSize: "100% 100%",
//             display: "flex",
//             flexDirection: "column",
//             flexWrap: "nowrap",
//             height: "100%",
//             justifyContent: "center",
//             textAlign: "center",
//             width: "100%",
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             <img
//               key={9}
//               style={{ zIndex: 1, width: "102%" }}
//               src={`/frames/chooseday.png`}
//             />
//           </div>
//           {state.validity.day.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "630px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.day.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "810px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(1)}
//             </div>
//           )}{" "}
//           {state.validity.day.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "630px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               0
//             </div>
//           )}
//           {state.validity.day.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "810px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1115px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1300px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(1)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1115px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               0
//             </div>
//           )}
//           {state.validity.hours.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1300px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.minutes.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1590px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.minutes.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.minutes.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1775px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.minutes.toString().charAt(1)}
//             </div>
//           )}
//           {state.validity.minutes.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1590px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               0
//             </div>
//           )}
//           {state.validity.minutes.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1775px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.minutes.toString().charAt(0)}
//             </div>
//           )}
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "210px",
//               left: "200px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.question}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.a}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.b}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.c}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.d}
//           </div>
//         </div>
//       ),
//       intents: [
//         <TextInput placeholder="Enter Days in DD format" />,
//         <Button action="/createop4">Back ↩️</Button>,
//         <Button action="/choosehours">Next ➡️</Button>,
//       ],
//     });
// });
// app.frame("/choosehours", (c) => {
//   const { frameData, deriveState } = c;
//   const days = frameData?.inputText;
//   const parsedDays = parseInt(days != undefined ? days : "0");
//   const state = deriveState((previousState) => {
//     if (days !== undefined) {
//       if (!isNaN(parsedDays) && days.length < 3 && days.length > 0) {
//         previousState.validity.day = parsedDays;
//       }
//     }
//   });
//   if (
//     frameData?.buttonIndex != 1 &&
//     (days == undefined ||
//       isNaN(parsedDays) ||
//       days!.length > 2 ||
//       days!.length < 0)
//   ) {
//     return c.res({
//       action: "/choosehours",
//       image: (
//         <div
//           style={{
//             alignItems: "center",
//             background: "white",
//             backgroundSize: "100% 100%",
//             display: "flex",
//             flexDirection: "column",
//             flexWrap: "nowrap",
//             height: "100%",
//             justifyContent: "center",
//             textAlign: "center",
//             width: "100%",
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             <img
//               key={9}
//               style={{ zIndex: 1, width: "102%" }}
//               src={`/frames/choosedayE.png`}
//             />
//           </div>
//           {state.validity.day.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "630px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.day.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "810px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(1)}
//             </div>
//           )}{" "}
//           {state.validity.day.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "630px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               0
//             </div>
//           )}
//           {state.validity.day.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "810px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1115px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1300px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(1)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1115px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               0
//             </div>
//           )}
//           {state.validity.hours.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1300px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.minutes.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1590px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.minutes.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.minutes.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1775px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.minutes.toString().charAt(1)}
//             </div>
//           )}
//           {state.validity.minutes.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1590px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               0
//             </div>
//           )}
//           {state.validity.minutes.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1775px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.minutes.toString().charAt(0)}
//             </div>
//           )}
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "210px",
//               left: "200px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.question}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.a}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.b}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.c}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.d}
//           </div>
//         </div>
//       ),
//       intents: [
//         <TextInput placeholder="Enter Days in proper DD format" />,
//         <Button action="/createop4">Back ↩️</Button>,
//         <Button action="/choosehours">Next ➡️</Button>,
//       ],
//     });
//   } else
//     return c.res({
//       image: (
//         <div
//           style={{
//             alignItems: "center",
//             background: "white",
//             backgroundSize: "100% 100%",
//             display: "flex",
//             flexDirection: "column",
//             flexWrap: "nowrap",
//             height: "100%",
//             justifyContent: "center",
//             textAlign: "center",
//             width: "100%",
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             <img
//               key={9}
//               style={{ zIndex: 1, width: "102%" }}
//               src={`/frames/choosehr.png`}
//             />
//           </div>
//           {state.validity.day.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "630px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.day.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "810px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(1)}
//             </div>
//           )}{" "}
//           {state.validity.day.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "630px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               0
//             </div>
//           )}
//           {state.validity.day.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "810px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1115px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1300px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(1)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1115px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               0
//             </div>
//           )}
//           {state.validity.hours.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1300px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(0)}
//             </div>
//           )}
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "106px",
//               left: "0px",
//               right: "30px",
//               marginRight: "30px",
//               width: "1590px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             0
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "106px",
//               left: "0px",
//               right: "10px",
//               width: "1775px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             0
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "210px",
//               left: "200px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.question}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.a}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.b}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.c}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.d}
//           </div>
//         </div>
//       ),
//       intents: [
//         <TextInput placeholder="Enter Hours in hh format" />,
//         <Button action="/chooseday">Back ↩️</Button>,
//         <Button action="/choosemins">Next ➡️</Button>,
//       ],
//     });
// });
// app.frame("/choosemins", (c) => {
//   const { frameData, deriveState } = c;
//   const hours = frameData?.inputText;
//   const parsedhours = parseInt(hours != undefined ? hours : "0");
//   console.log("Frame data");
//   console.log(frameData);
//   const state = deriveState((previousState) => {
//     if (hours !== undefined) {
//       if (!isNaN(parsedhours) && parsedhours <= 24) {
//         previousState.validity.hours = parseInt(hours);
//       }
//     }
//   });
//   if (
//     frameData?.buttonIndex != 1 &&
//     (hours == undefined || isNaN(parsedhours) || parsedhours > 23)
//   ) {
//     return c.res({
//       image: (
//         <div
//           style={{
//             alignItems: "center",
//             background: "white",
//             backgroundSize: "100% 100%",
//             display: "flex",
//             flexDirection: "column",
//             flexWrap: "nowrap",
//             height: "100%",
//             justifyContent: "center",
//             textAlign: "center",
//             width: "100%",
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             <img
//               key={9}
//               style={{ zIndex: 1, width: "102%" }}
//               src={`/frames/choosehrE.png`}
//             />
//           </div>
//           {state.validity.day.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "630px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.day.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "810px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(1)}
//             </div>
//           )}{" "}
//           {state.validity.day.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "630px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               0
//             </div>
//           )}
//           {state.validity.day.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "810px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1115px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1300px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(1)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1115px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               0
//             </div>
//           )}
//           {state.validity.hours.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1300px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(0)}
//             </div>
//           )}
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "106px",
//               left: "0px",
//               right: "30px",
//               marginRight: "30px",
//               width: "1590px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             0
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "106px",
//               left: "0px",
//               right: "10px",
//               width: "1775px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             0
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "210px",
//               left: "200px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.question}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.a}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.b}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.c}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.d}
//           </div>
//         </div>
//       ),
//       intents: [
//         <TextInput placeholder="Enter hours in proper HH format" />,
//         <Button action="/chooseday">Back ↩️</Button>,
//         <Button action="/choosemins">Next ➡️</Button>,
//       ],
//     });
//   } else
//     return c.res({
//       image: (
//         <div
//           style={{
//             alignItems: "center",
//             background: "white",
//             backgroundSize: "100% 100%",
//             display: "flex",
//             flexDirection: "column",
//             flexWrap: "nowrap",
//             height: "100%",
//             justifyContent: "center",
//             textAlign: "center",
//             width: "100%",
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             <img
//               key={9}
//               style={{ zIndex: 1, width: "102%" }}
//               src={`/frames/choosemin.png`}
//             />
//           </div>
//           {state.validity.day.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "630px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.day.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "810px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(1)}
//             </div>
//           )}{" "}
//           {state.validity.day.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "630px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               0
//             </div>
//           )}
//           {state.validity.day.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "810px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1115px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1300px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(1)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1115px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               0
//             </div>
//           )}
//           {state.validity.hours.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1300px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.minutes.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1590px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.minutes.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.minutes.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1775px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.minutes.toString().charAt(1)}
//             </div>
//           )}
//           {state.validity.minutes.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1590px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               0
//             </div>
//           )}
//           {state.validity.minutes.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1775px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.minutes.toString().charAt(0)}
//             </div>
//           )}
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "210px",
//               left: "200px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.question}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.a}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.b}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.c}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.d}
//           </div>
//         </div>
//       ),
//       intents: [
//         <TextInput placeholder="Enter Minutes in MM format" />,
//         <Button action="/choosehours">Back ↩️</Button>,
//         <Button action="/create">Next ➡️</Button>,
//       ],
//     });
// });
// app.frame("/choosetheme/:theme", (c) => {
//   const params = c.req.param();
//   const theme = params["theme"];
//   const { deriveState } = c;
//   const state = deriveState((previousState) => {
//     if (theme !== undefined) {
//       previousState.theme = parseInt(theme);
//     }
//   });
//   return c.res({
//     // action: "/createpoll",
//     action: "/createpoll",
//     image: (
//       <div
//         style={
//           state.theme == 0 || state.theme == 6
//             ? {
//                 alignItems: "center",
//                 background: "white",
//                 backgroundSize: "100% 100%",
//                 display: "flex",
//                 flexDirection: "column",
//                 flexWrap: "nowrap",
//                 height: "100%",
//                 justifyContent: "center",
//                 textAlign: "center",
//                 width: "100%",
//                 color: "black",
//               }
//             : {
//                 alignItems: "center",
//                 background: "white",
//                 backgroundSize: "100% 100%",
//                 display: "flex",
//                 flexDirection: "column",
//                 flexWrap: "nowrap",
//                 height: "100%",
//                 justifyContent: "center",
//                 textAlign: "center",
//                 width: "100%",
//                 color: "white",
//               }
//         }
//       >
//         <div style={{ display: "flex" }}>
//           <img
//             key={10}
//             style={{ zIndex: 1, width: "102%" }}
//             src={
//               state.theme == 0
//                 ? `/frames/validity.png`
//                 : `/frames/theme${state.theme}.png`
//             }
//           />
//         </div>
//         {state.validity.day.toString().length == 2 && (
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "105px",
//               left: "0px",
//               right: "30px",
//               marginRight: "30px",
//               width: "620px",
//               textWrap: "wrap",
//               zIndex: 10,
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.validity.day.toString().charAt(0)}
//           </div>
//         )}
//         {state.validity.day.toString().length == 2 && (
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "105px",
//               left: "0px",
//               right: "10px",
//               width: "810px",
//               textWrap: "wrap",
//               zIndex: 10,
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.validity.day.toString().charAt(1)}
//           </div>
//         )}{" "}
//         {state.validity.day.toString().length == 1 && (
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "105px",
//               left: "0px",
//               right: "30px",
//               marginRight: "30px",
//               width: "620px",
//               textWrap: "wrap",
//               zIndex: 10,
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             0
//           </div>
//         )}
//         {state.validity.day.toString().length == 1 && (
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "105px",
//               left: "0px",
//               right: "10px",
//               width: "810px",
//               textWrap: "wrap",
//               zIndex: 10,
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.validity.day.toString().charAt(0)}
//           </div>
//         )}
//         {state.validity.hours.toString().length == 2 && (
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "105px",
//               left: "0px",
//               right: "30px",
//               marginRight: "30px",
//               width: "1115px",
//               textWrap: "wrap",
//               zIndex: 10,
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.validity.hours.toString().charAt(0)}
//           </div>
//         )}
//         {state.validity.hours.toString().length == 2 && (
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "105px",
//               left: "0px",
//               right: "10px",
//               width: "1300px",
//               textWrap: "wrap",
//               zIndex: 10,
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.validity.hours.toString().charAt(1)}
//           </div>
//         )}
//         {state.validity.hours.toString().length == 1 && (
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "105px",
//               left: "0px",
//               right: "30px",
//               marginRight: "30px",
//               width: "1115px",
//               textWrap: "wrap",
//               zIndex: 10,
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             0
//           </div>
//         )}
//         {state.validity.hours.toString().length == 1 && (
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "105px",
//               left: "0px",
//               right: "10px",
//               width: "1300px",
//               textWrap: "wrap",
//               zIndex: 10,
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.validity.hours.toString().charAt(0)}
//           </div>
//         )}
//         {state.validity.minutes.toString().length == 2 && (
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "105px",
//               left: "0px",
//               right: "30px",
//               marginRight: "30px",
//               width: "1590px",
//               textWrap: "wrap",
//               zIndex: 10,
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.validity.minutes.toString().charAt(0)}
//           </div>
//         )}
//         {state.validity.minutes.toString().length == 2 && (
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "105px",
//               left: "0px",
//               right: "10px",
//               width: "1775px",
//               textWrap: "wrap",
//               zIndex: 10,
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.validity.minutes.toString().charAt(1)}
//           </div>
//         )}
//         {state.validity.minutes.toString().length == 1 && (
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "105px",
//               left: "0px",
//               right: "30px",
//               marginRight: "30px",
//               width: "1590px",
//               textWrap: "wrap",
//               zIndex: 10,
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             0
//           </div>
//         )}
//         {state.validity.minutes.toString().length == 1 && (
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "105px",
//               left: "0px",
//               right: "10px",
//               width: "1775px",
//               textWrap: "wrap",
//               zIndex: 10,
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.validity.minutes.toString().charAt(0)}
//           </div>
//         )}
//         <div
//           style={{
//             fontFamily: "fantasy",
//             fontSize: "50px",
//             position: "absolute",
//             top: "210px",
//             left: "200px",
//             width: "800px",
//             textWrap: "wrap",
//             zIndex: 10,
//             justifyContent: "center",
//             textAlign: "center",
//           }}
//         >
//           {state.question}
//         </div>
//         <div
//           style={{
//             fontFamily: "fantasy",
//             fontSize: "30px",
//             position: "absolute",
//             top: "418px",
//             left: "230px",
//             width: "800px",
//             textWrap: "wrap",
//             zIndex: 10,
//           }}
//         >
//           {state.options.a}
//         </div>
//         <div
//           style={{
//             fontFamily: "fantasy",
//             fontSize: "30px",
//             position: "absolute",
//             top: "418px",
//             left: "670px",
//             width: "800px",
//             textWrap: "wrap",
//             zIndex: 10,
//           }}
//         >
//           {state.options.b}
//         </div>
//         <div
//           style={{
//             fontFamily: "fantasy",
//             fontSize: "30px",
//             position: "absolute",
//             top: "535px",
//             left: "230px",
//             width: "800px",
//             textWrap: "wrap",
//             zIndex: 10,
//           }}
//         >
//           {state.options.c}
//         </div>
//         <div
//           style={{
//             fontFamily: "fantasy",
//             fontSize: "30px",
//             position: "absolute",
//             top: "535px",
//             left: "670px",
//             width: "800px",
//             textWrap: "wrap",
//             zIndex: 10,
//           }}
//         >
//           {state.options.d}
//         </div>
//       </div>
//     ),
//     intents: [
//       <Button action="/createpreview">Back ↩️</Button>,
//       <Button
//         action={`/choosetheme/${
//           parseInt(theme) == 0 ? 6 : parseInt(theme) - 1
//         }`}
//       >
//         ⬅️
//       </Button>,
//       <Button
//         action={`/choosetheme/${
//           parseInt(theme) == 6 ? 0 : parseInt(theme) + 1
//         }`}
//       >
//         ➡️
//       </Button>,
//       <Button action="/createpreview">Select ✅</Button>,
//     ],
//   });
// });
// app.frame("/create", (c) => {
//   const { frameData, deriveState } = c;
//   const mins = frameData?.inputText;
//   const parsedMins = parseInt(mins != undefined ? mins : "0");

//   const state = deriveState((previousState) => {
//     if (mins !== undefined) {
//       if (!isNaN(parsedMins) && parsedMins <= 60)
//         previousState.validity.minutes = parseInt(mins);
//     }
//   });
//   process.env.POLL = JSON.stringify(state);
//   process.env.VALIDITY = (
//     state.validity.day * 24 * 60 * 60 +
//     state.validity.hours * 60 * 60 +
//     state.validity.minutes * 60
//   ).toString();
//   console.log("POLL");
//   console.log(process.env.POLL);
//   console.log("VALIDITY");
//   console.log(process.env.VALIDITY);

//   if (
//     frameData?.buttonIndex != 1 &&
//     (mins == undefined || isNaN(parsedMins) || parsedMins > 60)
//   ) {
//     return c.res({
//       image: (
//         <div
//           style={{
//             alignItems: "center",
//             background: "white",
//             backgroundSize: "100% 100%",
//             display: "flex",
//             flexDirection: "column",
//             flexWrap: "nowrap",
//             height: "100%",
//             justifyContent: "center",
//             textAlign: "center",
//             width: "100%",
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             <img
//               key={9}
//               style={{ zIndex: 1, width: "102%" }}
//               src={`/frames/chooseminE.png`}
//             />
//           </div>
//           {state.validity.day.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "630px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.day.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "810px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(1)}
//             </div>
//           )}{" "}
//           {state.validity.day.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "630px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               0
//             </div>
//           )}
//           {state.validity.day.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "810px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.day.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1115px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 2 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1300px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(1)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "30px",
//                 marginRight: "30px",
//                 width: "1115px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               0
//             </div>
//           )}
//           {state.validity.hours.toString().length == 1 && (
//             <div
//               style={{
//                 fontFamily: "fantasy",
//                 fontSize: "50px",
//                 position: "absolute",
//                 top: "106px",
//                 left: "0px",
//                 right: "10px",
//                 width: "1300px",
//                 textWrap: "wrap",
//                 zIndex: 10,
//                 color: "black",
//                 justifyContent: "center",
//                 textAlign: "center",
//               }}
//             >
//               {state.validity.hours.toString().charAt(0)}
//             </div>
//           )}
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "106px",
//               left: "0px",
//               right: "30px",
//               marginRight: "30px",
//               width: "1590px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             0
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "106px",
//               left: "0px",
//               right: "10px",
//               width: "1775px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             0
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "50px",
//               position: "absolute",
//               top: "210px",
//               left: "200px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//               justifyContent: "center",
//               textAlign: "center",
//             }}
//           >
//             {state.question}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.a}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "418px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.b}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "230px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.c}
//           </div>
//           <div
//             style={{
//               fontFamily: "fantasy",
//               fontSize: "30px",
//               position: "absolute",
//               top: "535px",
//               left: "670px",
//               width: "800px",
//               textWrap: "wrap",
//               zIndex: 10,
//               color: "black",
//             }}
//           >
//             {state.options.d}
//           </div>
//         </div>
//       ),
//       intents: [
//         <TextInput placeholder="Enter mins in proper MM format" />,
//         <Button action="/choosehours">Back ↩️</Button>,
//         <Button action="/createpreview">Next ➡️</Button>,
//       ],
//     });
//   } else
//     return c.res({
//       action: "/finish",
//       image: (
//         <div
//           style={{
//             alignItems: "center",
//             background: "white",
//             backgroundSize: "100% 100%",
//             display: "flex",
//             flexDirection: "column",
//             flexWrap: "nowrap",
//             height: "100%",
//             justifyContent: "center",
//             textAlign: "center",
//             width: "100%",
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             <img
//               key={9}
//               style={{ zIndex: -1, width: "102%" }}
//               src={`/frames/theme${state.theme}.png`}
//             />
//           </div>
//           {state.validity.day.toString().length == 2 && (
//             <div
//               style={
//                 state.theme == 0 || state.theme == 6
//                   ? {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "30px",
//                       marginRight: "30px",
//                       width: "630px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "black",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//                   : {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "30px",
//                       marginRight: "30px",
//                       width: "630px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "white",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//               }
//             >
//               {state.validity.day.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.day.toString().length == 2 && (
//             <div
//               style={
//                 state.theme == 0 || state.theme == 6
//                   ? {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "10px",
//                       width: "810px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "black",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//                   : {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "10px",
//                       width: "810px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "white",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//               }
//             >
//               {state.validity.day.toString().charAt(1)}
//             </div>
//           )}{" "}
//           {state.validity.day.toString().length == 1 && (
//             <div
//               style={
//                 state.theme == 0 || state.theme == 6
//                   ? {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "30px",
//                       marginRight: "30px",
//                       width: "630px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "black",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//                   : {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "30px",
//                       marginRight: "30px",
//                       width: "630px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "white",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//               }
//             >
//               0
//             </div>
//           )}
//           {state.validity.day.toString().length == 1 && (
//             <div
//               style={
//                 state.theme == 0 || state.theme == 6
//                   ? {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "10px",
//                       width: "810px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "black",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//                   : {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "10px",
//                       width: "810px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "white",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//               }
//             >
//               {state.validity.day.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 2 && (
//             <div
//               style={
//                 state.theme == 0 || state.theme == 6
//                   ? {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "30px",
//                       marginRight: "30px",
//                       width: "1115px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "black",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//                   : {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "30px",
//                       marginRight: "30px",
//                       width: "1115px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "white",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//               }
//             >
//               {state.validity.hours.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 2 && (
//             <div
//               style={
//                 state.theme == 0 || state.theme == 6
//                   ? {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "10px",
//                       width: "1300px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "black",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//                   : {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "10px",
//                       width: "1300px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "white",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//               }
//             >
//               {state.validity.hours.toString().charAt(1)}
//             </div>
//           )}
//           {state.validity.hours.toString().length == 1 && (
//             <div
//               style={
//                 state.theme == 0 || state.theme == 6
//                   ? {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "30px",
//                       marginRight: "30px",
//                       width: "1115px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "black",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//                   : {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "30px",
//                       marginRight: "30px",
//                       width: "1115px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "white",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//               }
//             >
//               0
//             </div>
//           )}
//           {state.validity.hours.toString().length == 1 && (
//             <div
//               style={
//                 state.theme == 0 || state.theme == 6
//                   ? {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "10px",
//                       width: "1300px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "black",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//                   : {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "10px",
//                       width: "1300px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "white",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//               }
//             >
//               {state.validity.hours.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.minutes.toString().length == 2 && (
//             <div
//               style={
//                 state.theme == 0 || state.theme == 6
//                   ? {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "30px",
//                       marginRight: "30px",
//                       width: "1590px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "black",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//                   : {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "30px",
//                       marginRight: "30px",
//                       width: "1590px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "white",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//               }
//             >
//               {state.validity.minutes.toString().charAt(0)}
//             </div>
//           )}
//           {state.validity.minutes.toString().length == 2 && (
//             <div
//               style={
//                 state.theme == 0 || state.theme == 6
//                   ? {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "10px",
//                       width: "1775px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "black",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//                   : {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "10px",
//                       width: "1775px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "white",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//               }
//             >
//               {state.validity.minutes.toString().charAt(1)}
//             </div>
//           )}
//           {state.validity.minutes.toString().length == 1 && (
//             <div
//               style={
//                 state.theme == 0 || state.theme == 6
//                   ? {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "30px",
//                       marginRight: "30px",
//                       width: "1590px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "black",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//                   : {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "30px",
//                       marginRight: "30px",
//                       width: "1590px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "white",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//               }
//             >
//               0
//             </div>
//           )}
//           {state.validity.minutes.toString().length == 1 && (
//             <div
//               style={
//                 state.theme == 0 || state.theme == 6
//                   ? {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "10px",
//                       width: "1775px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "black",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//                   : {
//                       fontFamily: "fantasy",
//                       fontSize: "50px",
//                       position: "absolute",
//                       top: "106px",
//                       left: "0px",
//                       right: "10px",
//                       width: "1775px",
//                       textWrap: "wrap",
//                       zIndex: 10,
//                       color: "white",
//                       justifyContent: "center",
//                       textAlign: "center",
//                     }
//               }
//             >
//               {state.validity.minutes.toString().charAt(0)}
//             </div>
//           )}
//           <div
//             style={
//               state.theme == 0 || state.theme == 6
//                 ? {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "210px",
//                     left: "200px",
//                     width: "800px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "black",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//                 : {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "210px",
//                     left: "200px",
//                     width: "800px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "white",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//             }
//           >
//             {state.question}
//           </div>
//           <div
//             style={
//               state.theme == 0 || state.theme == 6
//                 ? {
//                     fontFamily: "fantasy",
//                     fontSize: "30px",
//                     position: "absolute",
//                     top: "418px",
//                     left: "230px",
//                     width: "800px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "black",
//                   }
//                 : {
//                     fontFamily: "fantasy",
//                     fontSize: "30px",
//                     position: "absolute",
//                     top: "418px",
//                     left: "230px",
//                     width: "800px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "white",
//                   }
//             }
//           >
//             {state.options.a}
//           </div>
//           <div
//             style={
//               state.theme == 0 || state.theme == 6
//                 ? {
//                     fontFamily: "fantasy",
//                     fontSize: "30px",
//                     position: "absolute",
//                     top: "418px",
//                     left: "670px",
//                     width: "800px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "black",
//                   }
//                 : {
//                     fontFamily: "fantasy",
//                     fontSize: "30px",
//                     position: "absolute",
//                     top: "418px",
//                     left: "670px",
//                     width: "800px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "white",
//                   }
//             }
//           >
//             {state.options.b}
//           </div>
//           <div
//             style={
//               state.theme == 0 || state.theme == 6
//                 ? {
//                     fontFamily: "fantasy",
//                     fontSize: "30px",
//                     position: "absolute",
//                     top: "535px",
//                     left: "230px",
//                     width: "800px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "black",
//                   }
//                 : {
//                     fontFamily: "fantasy",
//                     fontSize: "30px",
//                     position: "absolute",
//                     top: "535px",
//                     left: "230px",
//                     width: "800px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "white",
//                   }
//             }
//           >
//             {state.options.c}
//           </div>
//           <div
//             style={
//               state.theme == 0 || state.theme == 6
//                 ? {
//                     fontFamily: "fantasy",
//                     fontSize: "30px",
//                     position: "absolute",
//                     top: "535px",
//                     left: "670px",
//                     width: "800px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "black",
//                   }
//                 : {
//                     fontFamily: "fantasy",
//                     fontSize: "30px",
//                     position: "absolute",
//                     top: "535px",
//                     left: "670px",
//                     width: "800px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "white",
//                   }
//             }
//           >
//             {state.options.d}
//           </div>
//         </div>
//       ),
//       intents: [
//         <Button action="/choosemins">Back ↩️</Button>,
//         <Button action={"/choosetheme/" + state.theme}>Theme 🖼️</Button>,
//         <Button.Signature target="/sign">Sign</Button.Signature>,
//       ],
//     });
// });
// app.frame("/createpreview", (c) => {
//   const { frameData, deriveState } = c;
//   const state = deriveState();
//   return c.res({
//     action: "/finish",
//     image: (
//       <div
//         style={{
//           alignItems: "center",
//           background: "white",
//           backgroundSize: "100% 100%",
//           display: "flex",
//           flexDirection: "column",
//           flexWrap: "nowrap",
//           height: "100%",
//           justifyContent: "center",
//           textAlign: "center",
//           width: "100%",
//         }}
//       >
//         <div style={{ display: "flex" }}>
//           <img
//             key={9}
//             style={{ zIndex: -1, width: "102%" }}
//             src={`/frames/theme${state.theme}.png`}
//           />
//         </div>
//         {state.validity.day.toString().length == 2 && (
//           <div
//             style={
//               state.theme == 0 || state.theme == 6
//                 ? {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "30px",
//                     marginRight: "30px",
//                     width: "630px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "black",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//                 : {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "30px",
//                     marginRight: "30px",
//                     width: "630px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "white",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//             }
//           >
//             {state.validity.day.toString().charAt(0)}
//           </div>
//         )}
//         {state.validity.day.toString().length == 2 && (
//           <div
//             style={
//               state.theme == 0 || state.theme == 6
//                 ? {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "10px",
//                     width: "810px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "black",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//                 : {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "10px",
//                     width: "810px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "white",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//             }
//           >
//             {state.validity.day.toString().charAt(1)}
//           </div>
//         )}{" "}
//         {state.validity.day.toString().length == 1 && (
//           <div
//             style={
//               state.theme == 0 || state.theme == 6
//                 ? {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "30px",
//                     marginRight: "30px",
//                     width: "630px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "black",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//                 : {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "30px",
//                     marginRight: "30px",
//                     width: "630px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "white",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//             }
//           >
//             0
//           </div>
//         )}
//         {state.validity.day.toString().length == 1 && (
//           <div
//             style={
//               state.theme == 0 || state.theme == 6
//                 ? {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "10px",
//                     width: "810px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "black",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//                 : {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "10px",
//                     width: "810px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "white",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//             }
//           >
//             {state.validity.day.toString().charAt(0)}
//           </div>
//         )}
//         {state.validity.hours.toString().length == 2 && (
//           <div
//             style={
//               state.theme == 0 || state.theme == 6
//                 ? {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "30px",
//                     marginRight: "30px",
//                     width: "1115px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "black",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//                 : {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "30px",
//                     marginRight: "30px",
//                     width: "1115px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "white",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//             }
//           >
//             {state.validity.hours.toString().charAt(0)}
//           </div>
//         )}
//         {state.validity.hours.toString().length == 2 && (
//           <div
//             style={
//               state.theme == 0 || state.theme == 6
//                 ? {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "10px",
//                     width: "1300px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "black",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//                 : {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "10px",
//                     width: "1300px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "white",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//             }
//           >
//             {state.validity.hours.toString().charAt(1)}
//           </div>
//         )}
//         {state.validity.hours.toString().length == 1 && (
//           <div
//             style={
//               state.theme == 0 || state.theme == 6
//                 ? {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "30px",
//                     marginRight: "30px",
//                     width: "1115px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "black",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//                 : {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "30px",
//                     marginRight: "30px",
//                     width: "1115px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "white",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//             }
//           >
//             0
//           </div>
//         )}
//         {state.validity.hours.toString().length == 1 && (
//           <div
//             style={
//               state.theme == 0 || state.theme == 6
//                 ? {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "10px",
//                     width: "1300px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "black",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//                 : {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "10px",
//                     width: "1300px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "white",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//             }
//           >
//             {state.validity.hours.toString().charAt(0)}
//           </div>
//         )}
//         {state.validity.minutes.toString().length == 2 && (
//           <div
//             style={
//               state.theme == 0 || state.theme == 6
//                 ? {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "30px",
//                     marginRight: "30px",
//                     width: "1590px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "black",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//                 : {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "30px",
//                     marginRight: "30px",
//                     width: "1590px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "white",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//             }
//           >
//             {state.validity.minutes.toString().charAt(0)}
//           </div>
//         )}
//         {state.validity.minutes.toString().length == 2 && (
//           <div
//             style={
//               state.theme == 0 || state.theme == 6
//                 ? {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "10px",
//                     width: "1775px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "black",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//                 : {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "10px",
//                     width: "1775px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "white",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//             }
//           >
//             {state.validity.minutes.toString().charAt(1)}
//           </div>
//         )}
//         {state.validity.minutes.toString().length == 1 && (
//           <div
//             style={
//               state.theme == 0 || state.theme == 6
//                 ? {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "30px",
//                     marginRight: "30px",
//                     width: "1590px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "black",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//                 : {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "30px",
//                     marginRight: "30px",
//                     width: "1590px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "white",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//             }
//           >
//             0
//           </div>
//         )}
//         {state.validity.minutes.toString().length == 1 && (
//           <div
//             style={
//               state.theme == 0 || state.theme == 6
//                 ? {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "10px",
//                     width: "1775px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "black",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//                 : {
//                     fontFamily: "fantasy",
//                     fontSize: "50px",
//                     position: "absolute",
//                     top: "106px",
//                     left: "0px",
//                     right: "10px",
//                     width: "1775px",
//                     textWrap: "wrap",
//                     zIndex: 10,
//                     color: "white",
//                     justifyContent: "center",
//                     textAlign: "center",
//                   }
//             }
//           >
//             {state.validity.minutes.toString().charAt(0)}
//           </div>
//         )}
//         <div
//           style={
//             state.theme == 0 || state.theme == 6
//               ? {
//                   fontFamily: "fantasy",
//                   fontSize: "50px",
//                   position: "absolute",
//                   top: "210px",
//                   left: "200px",
//                   width: "800px",
//                   textWrap: "wrap",
//                   zIndex: 10,
//                   color: "black",
//                   justifyContent: "center",
//                   textAlign: "center",
//                 }
//               : {
//                   fontFamily: "fantasy",
//                   fontSize: "50px",
//                   position: "absolute",
//                   top: "210px",
//                   left: "200px",
//                   width: "800px",
//                   textWrap: "wrap",
//                   zIndex: 10,
//                   color: "white",
//                   justifyContent: "center",
//                   textAlign: "center",
//                 }
//           }
//         >
//           {state.question}
//         </div>
//         <div
//           style={
//             state.theme == 0 || state.theme == 6
//               ? {
//                   fontFamily: "fantasy",
//                   fontSize: "30px",
//                   position: "absolute",
//                   top: "418px",
//                   left: "230px",
//                   width: "800px",
//                   textWrap: "wrap",
//                   zIndex: 10,
//                   color: "black",
//                 }
//               : {
//                   fontFamily: "fantasy",
//                   fontSize: "30px",
//                   position: "absolute",
//                   top: "418px",
//                   left: "230px",
//                   width: "800px",
//                   textWrap: "wrap",
//                   zIndex: 10,
//                   color: "white",
//                 }
//           }
//         >
//           {state.options.a}
//         </div>
//         <div
//           style={
//             state.theme == 0 || state.theme == 6
//               ? {
//                   fontFamily: "fantasy",
//                   fontSize: "30px",
//                   position: "absolute",
//                   top: "418px",
//                   left: "670px",
//                   width: "800px",
//                   textWrap: "wrap",
//                   zIndex: 10,
//                   color: "black",
//                 }
//               : {
//                   fontFamily: "fantasy",
//                   fontSize: "30px",
//                   position: "absolute",
//                   top: "418px",
//                   left: "670px",
//                   width: "800px",
//                   textWrap: "wrap",
//                   zIndex: 10,
//                   color: "white",
//                 }
//           }
//         >
//           {state.options.b}
//         </div>
//         <div
//           style={
//             state.theme == 0 || state.theme == 6
//               ? {
//                   fontFamily: "fantasy",
//                   fontSize: "30px",
//                   position: "absolute",
//                   top: "535px",
//                   left: "230px",
//                   width: "800px",
//                   textWrap: "wrap",
//                   zIndex: 10,
//                   color: "black",
//                 }
//               : {
//                   fontFamily: "fantasy",
//                   fontSize: "30px",
//                   position: "absolute",
//                   top: "535px",
//                   left: "230px",
//                   width: "800px",
//                   textWrap: "wrap",
//                   zIndex: 10,
//                   color: "white",
//                 }
//           }
//         >
//           {state.options.c}
//         </div>
//         <div
//           style={
//             state.theme == 0 || state.theme == 6
//               ? {
//                   fontFamily: "fantasy",
//                   fontSize: "30px",
//                   position: "absolute",
//                   top: "535px",
//                   left: "670px",
//                   width: "800px",
//                   textWrap: "wrap",
//                   zIndex: 10,
//                   color: "black",
//                 }
//               : {
//                   fontFamily: "fantasy",
//                   fontSize: "30px",
//                   position: "absolute",
//                   top: "535px",
//                   left: "670px",
//                   width: "800px",
//                   textWrap: "wrap",
//                   zIndex: 10,
//                   color: "white",
//                 }
//           }
//         >
//           {state.options.d}
//         </div>
//       </div>
//     ),
//     intents: [
//       <Button action="/choosemins">Back ↩️</Button>,
//       <Button action={"/choosetheme/" + state.theme}>Theme 🖼️</Button>,
//       <Button action="/create-poll">Next ➡️</Button>,
//     ],
//   });
// });

// app.frame("/finish", (c) => {
//   const { transactionId } = c;
//   return c.res({
//     image: (
//       <div style={{ color: "white", display: "flex", fontSize: 60 }}>
//         Signature: {transactionId}
//       </div>
//     ),
//   });
// });

// app.signature("/sign", async (c) => {
//   // const { address, previousState } = c;
//   // const validity =
//   //   previousState.validity.day * 24 * 60 * 60 +
//   //   previousState.validity.hours * 60 * 60 +
//   //   previousState.validity.minutes * 60;
//   // const poll = {
//   //   question: previousState.question,
//   //   options: previousState.options,
//   //   validity: validity,
//   //   theme: previousState.theme,
//   // };
//   // console.log("VALIDITY");
//   // console.log(validity);
//   // console.log("POLL");
//   // console.log(poll);
//   // const { signData } = await getCreatePollSignData({
//   //   callerAddress: address as `0x${string}`,
//   //   poll: poll,
//   //   validity: validity,
//   // });
//   // console.log(signData)
//   return c.signTypedData({
//     chainId: "eip155:84532",
//     domain: {
//       name: "Ether Mail",
//       version: "1",
//       chainId: 1,
//       verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
//     },
//     types: {
//       Person: [
//         { name: "name", type: "string" },
//         { name: "wallet", type: "address" },
//         { name: "balance", type: "uint256" },
//       ],
//       Mail: [
//         { name: "from", type: "Person" },
//         { name: "to", type: "Person" },
//         { name: "contents", type: "string" },
//       ],
//     },
//     primaryType: "Mail",
//     message: {
//       from: {
//         name: "Cow",
//         wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
//         balance: BigInt("1"),
//       },
//       to: {
//         name: "Bob",
//         wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
//         balance: BigInt("1"),
//       },
//       contents: "Hello, Bob!",
//     },
//   });
// });

// app.frame("/createpoll", async (c) => {
//   const { frameData, deriveState } = c;
//   const state = deriveState();
//   const id = await insertData({
//     question: state.question,
//     fid: frameData?.fid.toString() || "123",
//     option_a: state.options.a,
//     option_b: state.options.b,
//     option_c: state.options.c,
//     option_d: state.options.d,
//     is_anon: true,
//     validity: state.validity.day,
//     farcaster_username: "test",
//     theme: state.theme,
//   });
//   console.log(id);
//   return c.res({
//     action: "/confirm",
//     image: (
//       <div
//         style={{
//           alignItems: "center",
//           background: "white",
//           backgroundSize: "100% 100%",
//           display: "flex",
//           flexDirection: "column",
//           flexWrap: "nowrap",
//           height: "100%",
//           justifyContent: "center",
//           textAlign: "center",
//           width: "100%",
//         }}
//       >
//         <div style={{ fontFamily: "fantasy", fontSize: "50px" }}>
//           {`/api/poll/${id}`}
//         </div>
//       </div>
//     ),
//     intents: [
//       // <Button.Transaction target="/sign">Create</Button.Transaction>,
//       <Button.Reset>Start Over</Button.Reset>,
//     ],
//   });
// });
app.frame(
  "/visualize/:question/a/:a/b/:b/c/:c/d/:d/theme/:theme",
  async (context) => {
    const { a, b, c, d, question, theme } = context.req.param();
    return context.res({
      image: (
        <div
          style={{
            alignItems: "center",
            background: "white",
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
              style={{ zIndex: 1, width: "102%" }}
              src={`/frames/theme${theme}.png`}
            />
          </div>
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "210px",
              left: "200px",
              width: "800px",
              textWrap: "wrap",
              zIndex: 10,
              color: theme == "0" || theme == "6" ? "black" : "white",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {question}
          </div>
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "30px",
              position: "absolute",
              top: "418px",
              left: "230px",
              width: "800px",
              textWrap: "wrap",
              zIndex: 10,
              color: theme == "0" || theme == "6" ? "black" : "white",
            }}
          >
            {a}
          </div>
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "30px",
              position: "absolute",
              top: "418px",
              left: "670px",
              width: "800px",
              textWrap: "wrap",
              zIndex: 10,
              color: theme == "0" || theme == "6" ? "black" : "white",
            }}
          >
            {b}
          </div>
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "30px",
              position: "absolute",
              top: "535px",
              left: "230px",
              width: "800px",
              textWrap: "wrap",
              zIndex: 10,
              color: theme == "0" || theme == "6" ? "black" : "white",
            }}
          >
            {c}
          </div>
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "30px",
              position: "absolute",
              top: "535px",
              left: "670px",
              width: "800px",
              textWrap: "wrap",
              zIndex: 10,
              color: theme == "0" || theme == "6" ? "black" : "white",
            }}
          >
            {d}
          </div>
        </div>
      ),
    });
  }
);
app.frame("/poll/:[pollid]", async (c) => {
  const params = c.req.param();
  const fetched = await fetchEntryById(parseInt(params["[pollid]"]));
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "white",
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
            style={{ zIndex: 1, width: "102%" }}
            src={`https://privcast.com/frames/theme${fetched?.theme}.png`}
          />
        </div>
        <div
          style={{
            fontFamily: "fantasy",
            fontSize: "50px",
            position: "absolute",
            top: "210px",
            left: "200px",
            width: "800px",
            textWrap: "wrap",
            zIndex: 10,
            color:
              fetched?.theme == 0 || fetched?.theme == 6 ? "black" : "white",

            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {fetched?.question}
        </div>
        <div
          style={{
            fontFamily: "fantasy",
            fontSize: "30px",
            position: "absolute",
            top: "418px",
            left: "230px",
            width: "800px",
            textWrap: "wrap",
            zIndex: 10,
            color:
              fetched?.theme == 0 || fetched?.theme == 6 ? "black" : "white",
          }}
        >
          {fetched?.op1}
        </div>
        <div
          style={{
            fontFamily: "fantasy",
            fontSize: "30px",
            position: "absolute",
            top: "418px",
            left: "670px",
            width: "800px",
            textWrap: "wrap",
            zIndex: 10,
            color:
              fetched?.theme == 0 || fetched?.theme == 6 ? "black" : "white",
          }}
        >
          {fetched?.op2}
        </div>
        <div
          style={{
            fontFamily: "fantasy",
            fontSize: "30px",
            position: "absolute",
            top: "535px",
            left: "230px",
            width: "800px",
            textWrap: "wrap",
            zIndex: 10,
            color:
              fetched?.theme == 0 || fetched?.theme == 6 ? "black" : "white",
          }}
        >
          {fetched?.op3}
        </div>
        <div
          style={{
            fontFamily: "fantasy",
            fontSize: "30px",
            position: "absolute",
            top: "535px",
            left: "670px",
            width: "800px",
            textWrap: "wrap",
            zIndex: 10,
            color:
              fetched?.theme == 0 || fetched?.theme == 6 ? "black" : "white",
          }}
        >
          {fetched?.op4}
        </div>
      </div>
    ),
    intents: [
      <Button.Link href={`https://privcast.com/polls/${params["[pollid]"]}`}>
        Google
      </Button.Link>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
