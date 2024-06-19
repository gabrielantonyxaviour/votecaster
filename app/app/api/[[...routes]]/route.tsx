/** @jsxImportSource frog/jsx */

import { fetchEntryById, insertData } from "@/utils/supabase";
import getCreatePollSignData from "@/utils/write/helpers/getCreatePollSignData";
import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { get } from "http";
import { BytesToNumberOpts, parseEther } from "viem";

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
app.frame("/", (c) => {
  return c.res({
    action: "/createqn",
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
      <Button value="apples">Create 🪄</Button>,
      <Button.Link href="http://privcast.com/">Visit PrivCast</Button.Link>,
    ],
  });
});

app.frame("/test", (c) => {
  return c.res({
    action: "/tx",
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
    intents: [<Button action="/tx">Test</Button>],
  });
});
app.frame("/createqn", (c) => {
  const { deriveState } = c;
  const state = deriveState();

  return c.res({
    action: "/createop1",
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
        <img key={1} style={{ width: "102%" }} src={`/frames/create1.png`} />
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
            color: "black",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {state.question}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter your question" />,
      <Button.Reset>Back ↩️</Button.Reset>,
      <Button value="op1">Next ➡️</Button>,
    ],
  });
});
app.frame("/createop1", (c) => {
  const { frameData, deriveState } = c;
  const question = frameData?.inputText;
  console.log("question 0 ", question);
  const state = deriveState((previousState) => {
    if (question?.length != 0 && question != undefined) {
      console.log("Question is not empty");
      console.log("question", question);
      previousState.question = question;
    } else {
      console.log("Question is empty");
    }
  });
  if (state.question == "") {
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
              key={11}
              style={{ zIndex: 1, width: "102%" }}
              src={`/frames/create1E.png`}
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
              color: "red",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            Question Cannot be Empty
          </div>
        </div>
      ),
      intents: [<Button action="/createqn">Back ↩️</Button>],
    });
  } else
    return c.res({
      action: "/createop2",
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
              key={3}
              style={{ zIndex: 1, width: "102%" }}
              src={`/frames/create2.png`}
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
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.question}
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
              color: "black",
            }}
          >
            {state.options.a}
          </div>
        </div>
      ),
      intents: [
        <TextInput placeholder="Enter Option A" />,
        <Button action="/createqn">Back ↩️</Button>,
        <Button value="op1">Next ➡️</Button>,
      ],
    });
});
app.frame("/createop2", (c) => {
  const { frameData, deriveState } = c;
  const op1 = frameData?.inputText;
  console.log(op1);
  const state = deriveState((previousState) => {
    if (op1 !== undefined) {
      previousState.options.a = op1;
      if (previousState.optionsCreated == 0) previousState.optionsCreated = 1;
    }
  });
  if (state.options.a == "") {
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
              key={11}
              style={{ zIndex: 1, width: "102%" }}
              src={`/frames/create2E.png`}
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
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.question}
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
              color: "red",
            }}
          >
            Enter Option
          </div>
        </div>
      ),
      intents: [<Button action="/createop1">Back ↩️</Button>],
    });
  } else
    return c.res({
      action: "/createop3",
      image: (
        <div
          key={2}
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
              key={5}
              style={{ zIndex: 1, width: "102%" }}
              src={`/frames/create3.png`}
            />
          </div>
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "200px",
              left: "200px",
              width: "800px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.question}
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
              color: "black",
            }}
          >
            {state.options.a}
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
              color: "black",
            }}
          >
            {state.options.b}
          </div>
        </div>
      ),
      intents: [
        <TextInput placeholder="Enter Option B" />,
        <Button action="/createop1">Back ↩️</Button>,
        <Button value="op2">Next ➡️</Button>,
      ],
    });
});
app.frame("/createop3", (c) => {
  const { frameData, deriveState } = c;
  const op2 = frameData?.inputText;
  console.log(op2);
  const state = deriveState((previousState) => {
    if (op2 !== undefined) {
      previousState.options.b = op2;
      if (previousState.optionsCreated == 1) previousState.optionsCreated = 2;
    }
  });
  if (state.options.b == "") {
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
              key={11}
              style={{ zIndex: 1, width: "102%" }}
              src={`/frames/create3E.png`}
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
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.question}
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
              color: "black",
            }}
          >
            {state.options.a}
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
              color: "red",
            }}
          >
            Enter Option
          </div>
        </div>
      ),
      intents: [<Button action="/createop2">Back ↩️</Button>],
    });
  } else
    return c.res({
      action: "/createop4",
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
              key={7}
              style={{ zIndex: 1, width: "102%" }}
              src={`/frames/create4.png`}
            />
          </div>
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "200px",
              left: "200px",
              width: "800px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.question}
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
              color: "black",
            }}
          >
            {state.options.a}
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
              color: "black",
            }}
          >
            {state.options.b}
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
              color: "black",
            }}
          >
            {state.options.c}
          </div>
        </div>
      ),
      intents: [
        <TextInput placeholder="Enter Option C" />,
        <Button action="/createop2">Back ↩️</Button>,
        <Button value="op3">Next ➡️</Button>,
      ],
    });
});
app.frame("/createop4", (c) => {
  const { frameData, deriveState } = c;
  const op3 = frameData?.inputText;
  console.log(op3);
  const state = deriveState((previousState) => {
    if (op3 !== undefined) {
      previousState.options.c = op3;
      if (previousState.optionsCreated == 2) previousState.optionsCreated = 3;
    }
  });
  if (state.options.c == "") {
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
              key={11}
              style={{ zIndex: 1, width: "102%" }}
              src={`/frames/create4E.png`}
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
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.question}
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
              color: "black",
            }}
          >
            {state.options.a}
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
              color: "black",
            }}
          >
            {state.options.b}
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
              color: "red",
            }}
          >
            Enter Option
          </div>
        </div>
      ),
      intents: [<Button action="/createop3">Back ↩️</Button>],
    });
  } else
    return c.res({
      action: "/chooseday",
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
              key={8}
              style={{ zIndex: 1, width: "102%" }}
              src={`/frames/create5.png`}
            />
          </div>
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "200px",
              left: "200px",
              width: "800px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.question}
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
              color: "black",
            }}
          >
            {state.options.a}
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
              color: "black",
            }}
          >
            {state.options.b}
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
              color: "black",
            }}
          >
            {state.options.c}
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
              color: "black",
            }}
          >
            {state.options.d}
          </div>
        </div>
      ),
      intents: [
        <TextInput placeholder="Enter Option D" />,
        <Button action="/createop3">Back ↩️</Button>,
        <Button>Next ➡️</Button>,
      ],
    });
});
app.frame("/chooseday", (c) => {
  const { frameData, deriveState } = c;
  const op4 = frameData?.inputText;
  console.log(op4);
  const state = deriveState((previousState) => {
    if (op4 != undefined) {
      previousState.options.d = op4;
      if (previousState.optionsCreated == 3) previousState.optionsCreated = 4;
    }
  });
  if (state.options.d == "") {
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
              key={11}
              style={{ zIndex: 1, width: "102%" }}
              src={`/frames/create5E.png`}
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
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.question}
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
              color: "black",
            }}
          >
            {state.options.a}
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
              color: "black",
            }}
          >
            {state.options.b}
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
              color: "black",
            }}
          >
            {state.options.c}
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
              color: "red",
            }}
          >
            Enter Option
          </div>
        </div>
      ),
      intents: [<Button action="/createop4">Back ↩️</Button>],
    });
  } else
    return c.res({
      action: "/choosehours",
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
              key={9}
              style={{ zIndex: 1, width: "102%" }}
              src={`/frames/chooseday.png`}
            />
          </div>
          {state.validity.day.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "630px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(0)}
            </div>
          )}
          {state.validity.day.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "810px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(1)}
            </div>
          )}{" "}
          {state.validity.day.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "630px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.day.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "810px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(0)}
            </div>
          )}
          {state.validity.hours.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1115px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(0)}
            </div>
          )}
          {state.validity.hours.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1300px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(1)}
            </div>
          )}
          {state.validity.hours.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1115px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.hours.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1300px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(0)}
            </div>
          )}
          {state.validity.minutes.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1590px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.minutes.toString().charAt(0)}
            </div>
          )}
          {state.validity.minutes.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1775px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.minutes.toString().charAt(1)}
            </div>
          )}
          {state.validity.minutes.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1590px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.minutes.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1775px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.minutes.toString().charAt(0)}
            </div>
          )}
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
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.question}
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
              color: "black",
            }}
          >
            {state.options.a}
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
              color: "black",
            }}
          >
            {state.options.b}
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
              color: "black",
            }}
          >
            {state.options.c}
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
              color: "black",
            }}
          >
            {state.options.d}
          </div>
        </div>
      ),
      intents: [
        <TextInput placeholder="Enter Days in DD format" />,
        <Button action="/createop4">Back ↩️</Button>,

        <Button action="/choosehours">Next ➡️</Button>,
      ],
    });
});
app.frame("/choosehours", (c) => {
  const { frameData, deriveState } = c;
  const days = frameData?.inputText;
  const parsedDays = parseInt(days != undefined ? days : "0");
  const state = deriveState((previousState) => {
    if (days !== undefined) {
      if (!isNaN(parsedDays) && days.length < 3 && days.length > 0) {
        previousState.validity.day = parsedDays;
      }
    }
  });
  if (
    frameData?.buttonIndex != 1 &&
    (days == undefined ||
      isNaN(parsedDays) ||
      days!.length > 2 ||
      days!.length < 0)
  ) {
    return c.res({
      action: "/choosehours",
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
              key={9}
              style={{ zIndex: 1, width: "102%" }}
              src={`/frames/choosedayE.png`}
            />
          </div>
          {state.validity.day.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "630px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(0)}
            </div>
          )}
          {state.validity.day.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "810px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(1)}
            </div>
          )}{" "}
          {state.validity.day.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "630px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.day.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "810px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(0)}
            </div>
          )}
          {state.validity.hours.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1115px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(0)}
            </div>
          )}
          {state.validity.hours.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1300px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(1)}
            </div>
          )}
          {state.validity.hours.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1115px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.hours.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1300px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(0)}
            </div>
          )}
          {state.validity.minutes.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1590px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.minutes.toString().charAt(0)}
            </div>
          )}
          {state.validity.minutes.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1775px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.minutes.toString().charAt(1)}
            </div>
          )}
          {state.validity.minutes.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1590px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.minutes.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1775px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.minutes.toString().charAt(0)}
            </div>
          )}
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
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.question}
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
              color: "black",
            }}
          >
            {state.options.a}
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
              color: "black",
            }}
          >
            {state.options.b}
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
              color: "black",
            }}
          >
            {state.options.c}
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
              color: "black",
            }}
          >
            {state.options.d}
          </div>
        </div>
      ),
      intents: [
        <TextInput placeholder="Enter Days in proper DD format" />,
        <Button action="/createop4">Back ↩️</Button>,

        <Button action="/choosehours">Next ➡️</Button>,
      ],
    });
  } else
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
              key={9}
              style={{ zIndex: 1, width: "102%" }}
              src={`/frames/choosehr.png`}
            />
          </div>
          {state.validity.day.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "630px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(0)}
            </div>
          )}
          {state.validity.day.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "810px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(1)}
            </div>
          )}{" "}
          {state.validity.day.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "630px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.day.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "810px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(0)}
            </div>
          )}
          {state.validity.hours.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1115px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(0)}
            </div>
          )}
          {state.validity.hours.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1300px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(1)}
            </div>
          )}
          {state.validity.hours.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1115px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.hours.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1300px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(0)}
            </div>
          )}
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "106px",
              left: "0px",
              right: "30px",
              marginRight: "30px",
              width: "1590px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            0
          </div>
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "106px",
              left: "0px",
              right: "10px",
              width: "1775px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            0
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
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.question}
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
              color: "black",
            }}
          >
            {state.options.a}
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
              color: "black",
            }}
          >
            {state.options.b}
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
              color: "black",
            }}
          >
            {state.options.c}
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
              color: "black",
            }}
          >
            {state.options.d}
          </div>
        </div>
      ),
      intents: [
        <TextInput placeholder="Enter Hours in hh format" />,
        <Button action="/chooseday">Back ↩️</Button>,

        <Button action="/choosemins">Next ➡️</Button>,
      ],
    });
});
app.frame("/choosemins", (c) => {
  const { frameData, deriveState } = c;
  const hours = frameData?.inputText;
  const parsedhours = parseInt(hours != undefined ? hours : "0");
  console.log("Frame data");
  console.log(frameData);
  const state = deriveState((previousState) => {
    if (hours !== undefined) {
      if (!isNaN(parsedhours) && hours.length < 3 && hours.length > 0) {
        if (parsedhours < 24) previousState.validity.hours = parseInt(hours);
        else {
          previousState.validity.hours = parsedhours % 24;
          previousState.validity.day += parseInt((parsedhours / 24).toFixed(0));
        }
      }
    }
  });
  if (
    frameData?.buttonIndex != 1 &&
    (hours == undefined ||
      isNaN(parsedhours) ||
      hours!.length > 2 ||
      hours!.length < 0)
  ) {
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
              key={9}
              style={{ zIndex: 1, width: "102%" }}
              src={`/frames/choosehrE.png`}
            />
          </div>
          {state.validity.day.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "630px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(0)}
            </div>
          )}
          {state.validity.day.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "810px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(1)}
            </div>
          )}{" "}
          {state.validity.day.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "630px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.day.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "810px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(0)}
            </div>
          )}
          {state.validity.hours.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1115px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(0)}
            </div>
          )}
          {state.validity.hours.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1300px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(1)}
            </div>
          )}
          {state.validity.hours.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1115px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.hours.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1300px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(0)}
            </div>
          )}
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "106px",
              left: "0px",
              right: "30px",
              marginRight: "30px",
              width: "1590px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            0
          </div>
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "106px",
              left: "0px",
              right: "10px",
              width: "1775px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            0
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
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.question}
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
              color: "black",
            }}
          >
            {state.options.a}
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
              color: "black",
            }}
          >
            {state.options.b}
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
              color: "black",
            }}
          >
            {state.options.c}
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
              color: "black",
            }}
          >
            {state.options.d}
          </div>
        </div>
      ),
      intents: [
        <TextInput placeholder="Enter Hours in proper HH format" />,
        <Button action="/chooseday">Back ↩️</Button>,

        <Button action="/choosemins">Next ➡️</Button>,
      ],
    });
  } else
    return c.res({
      action: "/createpreview",
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
              key={9}
              style={{ zIndex: 1, width: "102%" }}
              src={`/frames/choosemin.png`}
            />
          </div>
          {state.validity.day.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "630px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(0)}
            </div>
          )}
          {state.validity.day.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "810px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(1)}
            </div>
          )}{" "}
          {state.validity.day.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "630px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.day.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "810px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(0)}
            </div>
          )}
          {state.validity.hours.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1115px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(0)}
            </div>
          )}
          {state.validity.hours.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1300px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(1)}
            </div>
          )}
          {state.validity.hours.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1115px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.hours.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1300px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(0)}
            </div>
          )}
          {state.validity.minutes.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1590px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.minutes.toString().charAt(0)}
            </div>
          )}
          {state.validity.minutes.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1775px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.minutes.toString().charAt(1)}
            </div>
          )}
          {state.validity.minutes.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1590px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.minutes.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1775px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.minutes.toString().charAt(0)}
            </div>
          )}
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
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.question}
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
              color: "black",
            }}
          >
            {state.options.a}
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
              color: "black",
            }}
          >
            {state.options.b}
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
              color: "black",
            }}
          >
            {state.options.c}
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
              color: "black",
            }}
          >
            {state.options.d}
          </div>
        </div>
      ),
      intents: [
        <TextInput placeholder="Enter Minutes in MM format" />,
        <Button action="/choosehours">Back ↩️</Button>,

        <Button action="/create">Next ➡️</Button>,
      ],
    });
});

app.frame("/create", (c) => {
  const { frameData, deriveState } = c;
  const mins = frameData?.inputText;
  console.log("frameData");
  console.log(frameData);
  const parsedMins = parseInt(mins != undefined ? mins : "0");
  const state = deriveState((previousState) => {
    if (mins !== undefined) {
      if (!isNaN(parsedMins) && mins.length < 3 && mins.length > 0) {
        if (parsedMins < 60) previousState.validity.minutes = parseInt(mins);
        else {
          previousState.validity.minutes = parsedMins % 60;
          previousState.validity.hours += parseInt(
            (parsedMins / 60).toFixed(0)
          );
        }
      }
    }
  });
  if (
    frameData?.buttonIndex != 1 &&
    (mins == undefined ||
      isNaN(parsedMins) ||
      mins!.length > 2 ||
      mins!.length < 0)
  ) {
    return c.res({
      action: "/createpreview",
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
              key={9}
              style={{ zIndex: 1, width: "102%" }}
              src={`/frames/chooseminE.png`}
            />
          </div>
          {state.validity.day.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "630px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(0)}
            </div>
          )}
          {state.validity.day.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "810px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(1)}
            </div>
          )}{" "}
          {state.validity.day.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "630px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.day.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "810px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(0)}
            </div>
          )}
          {state.validity.hours.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1115px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(0)}
            </div>
          )}
          {state.validity.hours.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1300px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(1)}
            </div>
          )}
          {state.validity.hours.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1115px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.hours.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1300px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(0)}
            </div>
          )}
          {state.validity.minutes.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1590px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.minutes.toString().charAt(0)}
            </div>
          )}
          {state.validity.minutes.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1775px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.minutes.toString().charAt(1)}
            </div>
          )}
          {state.validity.minutes.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1590px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.minutes.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1775px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.minutes.toString().charAt(0)}
            </div>
          )}
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
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.question}
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
              color: "black",
            }}
          >
            {state.options.a}
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
              color: "black",
            }}
          >
            {state.options.b}
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
              color: "black",
            }}
          >
            {state.options.c}
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
              color: "black",
            }}
          >
            {state.options.d}
          </div>
        </div>
      ),
      intents: [
        <TextInput placeholder="Enter Minutes in proper MM format" />,
        <Button action="/choosehours">Back ↩️</Button>,

        <Button action="/createpreview">Next ➡️</Button>,
      ],
    });
  } else {
    process.env.POLL = JSON.stringify(state);
    process.env.VALIDITY = (
      state.validity.day * 24 * 60 * 60 +
      state.validity.hours * 60 * 60 +
      state.validity.minutes * 60
    ).toString();

    return c.res({
      action: "/createpoll",
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
              key={9}
              style={{ zIndex: 1, width: "102%" }}
              src={`/frames/validity.png`}
            />
          </div>
          {state.validity.day.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "630px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(0)}
            </div>
          )}
          {state.validity.day.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "810px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(1)}
            </div>
          )}{" "}
          {state.validity.day.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "630px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.day.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "810px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.day.toString().charAt(0)}
            </div>
          )}
          {state.validity.hours.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1115px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(0)}
            </div>
          )}
          {state.validity.hours.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1300px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(1)}
            </div>
          )}
          {state.validity.hours.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1115px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.hours.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1300px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.hours.toString().charAt(0)}
            </div>
          )}
          {state.validity.minutes.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1590px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.minutes.toString().charAt(0)}
            </div>
          )}
          {state.validity.minutes.toString().length == 2 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1775px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.minutes.toString().charAt(1)}
            </div>
          )}
          {state.validity.minutes.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "30px",
                marginRight: "30px",
                width: "1590px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              0
            </div>
          )}
          {state.validity.minutes.toString().length == 1 && (
            <div
              style={{
                fontFamily: "fantasy",
                fontSize: "50px",
                position: "absolute",
                top: "106px",
                left: "0px",
                right: "10px",
                width: "1775px",
                textWrap: "wrap",
                zIndex: 10,
                color: "black",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {state.validity.minutes.toString().charAt(0)}
            </div>
          )}
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
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.question}
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
              color: "black",
            }}
          >
            {state.options.a}
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
              color: "black",
            }}
          >
            {state.options.b}
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
              color: "black",
            }}
          >
            {state.options.c}
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
              color: "black",
            }}
          >
            {state.options.d}
          </div>
        </div>
      ),
      intents: [
        <Button action="/choosemins">Back ↩️</Button>,
        <Button action="/choosetheme/0">Theme 🖼️</Button>,
        <Button action="/create-poll">Next ➡️</Button>,
      ],
    });
  }
});

app.frame("/createpreview", (c) => {
  const { deriveState } = c;
  const state = deriveState();
  process.env.POLL = JSON.stringify(state);
  process.env.VALIDITY = (
    state.validity.day * 24 * 60 * 60 +
    state.validity.hours * 60 * 60 +
    state.validity.minutes * 60
  ).toString();
  console.log("POLL");
  console.log(process.env.POLL);
  console.log("VALIDITY");
  console.log(process.env.VALIDITY);
  return c.res({
    action: "/createpoll",
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
            key={9}
            style={{ zIndex: 1, width: "102%" }}
            src={`/frames/validity.png`}
          />
        </div>
        {state.validity.day.toString().length == 2 && (
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "106px",
              left: "0px",
              right: "30px",
              marginRight: "30px",
              width: "630px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.validity.day.toString().charAt(0)}
          </div>
        )}
        {state.validity.day.toString().length == 2 && (
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "106px",
              left: "0px",
              right: "10px",
              width: "810px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.validity.day.toString().charAt(1)}
          </div>
        )}{" "}
        {state.validity.day.toString().length == 1 && (
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "106px",
              left: "0px",
              right: "30px",
              marginRight: "30px",
              width: "630px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            0
          </div>
        )}
        {state.validity.day.toString().length == 1 && (
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "106px",
              left: "0px",
              right: "10px",
              width: "810px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.validity.day.toString().charAt(0)}
          </div>
        )}
        {state.validity.hours.toString().length == 2 && (
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "106px",
              left: "0px",
              right: "30px",
              marginRight: "30px",
              width: "1115px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.validity.hours.toString().charAt(0)}
          </div>
        )}
        {state.validity.hours.toString().length == 2 && (
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "106px",
              left: "0px",
              right: "10px",
              width: "1300px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.validity.hours.toString().charAt(1)}
          </div>
        )}
        {state.validity.hours.toString().length == 1 && (
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "106px",
              left: "0px",
              right: "30px",
              marginRight: "30px",
              width: "1115px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            0
          </div>
        )}
        {state.validity.hours.toString().length == 1 && (
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "106px",
              left: "0px",
              right: "10px",
              width: "1300px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.validity.hours.toString().charAt(0)}
          </div>
        )}
        {state.validity.minutes.toString().length == 2 && (
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "106px",
              left: "0px",
              right: "30px",
              marginRight: "30px",
              width: "1590px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.validity.minutes.toString().charAt(0)}
          </div>
        )}
        {state.validity.minutes.toString().length == 2 && (
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "106px",
              left: "0px",
              right: "10px",
              width: "1775px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.validity.minutes.toString().charAt(1)}
          </div>
        )}
        {state.validity.minutes.toString().length == 1 && (
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "106px",
              left: "0px",
              right: "30px",
              marginRight: "30px",
              width: "1590px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            0
          </div>
        )}
        {state.validity.minutes.toString().length == 1 && (
          <div
            style={{
              fontFamily: "fantasy",
              fontSize: "50px",
              position: "absolute",
              top: "106px",
              left: "0px",
              right: "10px",
              width: "1775px",
              textWrap: "wrap",
              zIndex: 10,
              color: "black",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {state.validity.minutes.toString().charAt(0)}
          </div>
        )}
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
            color: "black",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {state.question}
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
            color: "black",
          }}
        >
          {state.options.a}
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
            color: "black",
          }}
        >
          {state.options.b}
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
            color: "black",
          }}
        >
          {state.options.c}
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
            color: "black",
          }}
        >
          {state.options.d}
        </div>
      </div>
    ),
    intents: [
      <Button action="/choosemins">Back ↩️</Button>,
      <Button action="/choosetheme/0">Theme 🖼️</Button>,
      <Button action="/create-poll">Next ➡️</Button>,
    ],
  });
});

app.frame("/choosetheme/:theme", (c) => {
  const params = c.req.param();
  const theme = params["theme"];
  const { deriveState } = c;
  const state = deriveState((previousState) => {
    if (theme !== undefined) {
      previousState.theme = parseInt(theme);
    }
  });
  return c.res({
    // action: "/createpoll",
    action: "/createpoll",
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
            key={8}
            style={{ zIndex: -1, width: "102%" }}
            src={`/frames/theme${theme}.png`}
          />
        </div>
        <div
          style={
            state.theme == 0 || state.theme == 6
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
          {state.question}
        </div>
        <div
          style={
            state.theme == 0 || state.theme == 6
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
          {state.options.a}
        </div>
        <div
          style={
            state.theme == 0 || state.theme == 6
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
          {state.options.b}
        </div>
        <div
          style={
            state.theme == 0 || state.theme == 6
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
          {state.options.c}
        </div>
        <div
          style={
            state.theme == 0 || state.theme == 6
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
          {state.options.d}
        </div>
      </div>
    ),
    intents: [
      <Button action="/createpreview">Back ↩️</Button>,
      <Button
        action={`/choosetheme/${
          parseInt(theme) == 0 ? 6 : parseInt(theme) - 1
        }`}
      >
        ⬅️
      </Button>,
      <Button
        action={`/choosetheme/${
          parseInt(theme) == 6 ? 0 : parseInt(theme) + 1
        }`}
      >
        ➡️
      </Button>,
      <Button action="/createpreview">Select ✅</Button>,
    ],
  });
});

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
            src={`/frames/theme${fetched?.theme}.png`}
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
            color: "white",
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
            color: "white",
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
            color: "white",
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
            color: "white",
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
            color: "white",
          }}
        >
          {fetched?.op4}
        </div>
      </div>
    ),
    intents: [
      <Button value="a">A</Button>,
      <Button value="a">B</Button>,
      <Button value="a">C</Button>,
      <Button value="a">D</Button>,
    ],
  });
});

app.frame("/createpoll", async (c) => {
  const { frameData, deriveState } = c;
  const state = deriveState();
  const id = await insertData({
    question: state.question,
    fid: "123",
    option_a: state.options.a,
    option_b: state.options.b,
    option_c: state.options.c,
    option_d: state.options.d,
    is_anon: true,
    validity: 1,
    farcaster_username: "test",
    theme: state.theme,
  });
  console.log(id);
  return c.res({
    action: "/createpoll",
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
        <div style={{ fontFamily: "fantasy", fontSize: "50px" }}>
          {`/api/poll/${id}`}
        </div>
      </div>
    ),
    intents: [
      <Button value="op2">Create</Button>,
      <Button.Reset>Start Over</Button.Reset>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
