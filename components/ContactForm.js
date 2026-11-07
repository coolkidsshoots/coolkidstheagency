"use client";
import { useState } from "react";

const SERVICES = ["Photography", "Film / video", "Both", "Not sure yet"];

export default function ContactForm() {
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const [service, setService] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = Object.fromEntries(f.entries());
    body.service = service;
    setState("sending");
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="enq-done">
        <h2>Got it. Thank you.</h2>
        <p>Your enquiry is with us and we will be in touch soon.</p>
        <a className="enq-btn" href="/">Back to the work</a>
      </div>
    );
  }

  return (
    <form className="enq-form" onSubmit={onSubmit}>
      <label>
        <span>Your name *</span>
        <input name="name" type="text" autoComplete="name" required maxLength={120} />
      </label>
      <div className="enq-row">
        <label>
          <span>Email *</span>
          <input name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
        <label>
          <span>Phone <i>(optional)</i></span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
      </div>

      <fieldset>
        <legend>What do you need?</legend>
        <div className="enq-chips">
          {SERVICES.map((s) => (
            <button type="button" key={s} className={"enq-chip" + (service === s ? " on" : "")} onClick={() => setService(service === s ? "" : s)} aria-pressed={service === s}>
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <label>
        <span>Tell us about your project *</span>
        <textarea name="details" rows={6} required maxLength={4000} placeholder="What is it, who is it for, where, and anything else we should know." />
      </label>

      <label>
        <span>When do you need it? <i>(optional)</i></span>
        <input name="timeline" type="text" maxLength={200} placeholder="A date, a month, or ASAP" />
      </label>

      {/* hidden field: real people leave it empty, spam bots fill it in */}
      <div className="enq-hp" aria-hidden="true">
        <label>Company <input name="company" type="text" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <button className="enq-btn" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending..." : "Send enquiry →"}
      </button>

      {state === "error" && (
        <p className="enq-error" role="alert">
          Something went wrong sending that. Please email us directly at{" "}
          <a href="mailto:contact@coolkidstheagency.com">contact@coolkidstheagency.com</a>.
        </p>
      )}
    </form>
  );
}
