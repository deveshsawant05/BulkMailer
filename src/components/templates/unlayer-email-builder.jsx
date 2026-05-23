"use client";

import React, { useRef } from "react";
import EmailEditor from "react-email-editor";

export default function TestEditor() {
  const emailEditorRef = useRef(null);

  const onReady = (unlayer) => {
    console.log("READY", unlayer);

    unlayer.registerTool({
      name: "blank_tool",
      label: "Blank Tool",
      icon: "fa-square",

      supportedDisplayModes: ["email"],

      options: {},

      values: {},

      renderer: {
        Viewer: unlayer.createViewer({
          render() {
            return `<div style="padding:10px;">Blank</div>`;
          },
        }),

        exporters: {
          email() {
            return "";
          },
          web() {
            return "";
          },
        },
      },

      toolbox: {
        title: "Blank Tool",
        group: "Custom",
      },
    });
  };

  return (
    <EmailEditor
      ref={emailEditorRef}
      projectId={287107}
      onReady={onReady}
      minHeight="800px"
    />
  );
}