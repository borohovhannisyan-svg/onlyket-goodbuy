"use client";

import { FormEvent, useState } from "react";

type Status = "coming" | "not_coming";
type MessageType = "idle" | "success" | "error";

const mapUrl = "https://www.google.com/maps/search/?api=1&query=57CQ%2BR5%2C%20Vagharshapat";

export default function GoodbuyPage() {
  const [status, setStatus] = useState<Status>("coming");
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("1");
  const [company, setCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("Fill the form and send your RSVP.");
  const [messageType, setMessageType] = useState<MessageType>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessageType("idle");

    const trimmedName = name.trim();
    const guestCount = Number(guests);

    if (!trimmedName) {
      setMessage("Please write your name.");
      setMessageType("error");
      return;
    }

    if (!Number.isInteger(guestCount) || guestCount < 0 || guestCount > 99) {
      setMessage("Please add a valid number of guests.");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);
    setMessage("Sending your RSVP...");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          name: trimmedName,
          guests: guestCount,
          company
        })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setMessage(status === "coming" ? "Done. See you on July 11!" : "Done. Thanks for the answer.");
      setMessageType("success");
      setName("");
      setGuests("1");
      setCompany("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not send RSVP. Please try again.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page">
      <div className="noise" />
      <div className="shell">
        <section className="hero" aria-labelledby="party-title">
          <div className="card intro">
            <div>
              <div className="kicker"><span className="dot" /> SoftConstruct Style Invitation</div>
              <h1 id="party-title">Boris&apos; Goodbye Party</h1>
              <p className="lead">
                Dear colleague, it was a pleasure working with you and your team.
                Before I start my next chapter, I&apos;d love to spend one more evening together.
                <span className="highlight"> No speeches. No formalities.</span> Just good people,
                BBQ, drinks, music, pool and a great time.
              </p>
            </div>

            <div className="meta-grid" aria-label="Party details">
              <div className="meta-item">
                <span className="meta-label">Date</span>
                <span className="meta-value">Saturday<br />July 11, 2026</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Place</span>
                <span className="meta-value">Pool House<br />Vagharshapat</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Vibe</span>
                <span className="meta-value">Pool · BBQ<br />Drinks · DJ</span>
              </div>
            </div>
          </div>

          <div className="side">
            <div className="card panel">
              <h2>Location</h2>
              <p className="agenda-copy">Pool House · 57CQ+R5, Vagharshapat</p>
              <a className="map-button" href={mapUrl} target="_blank" rel="noreferrer">
                <span>Open in Google Maps</span>
                <span>↗</span>
              </a>
            </div>

            <div className="card panel">
              <h2>Agenda</h2>
              <div className="agenda">
                <div className="agenda-item">
                  <div className="time">16:00</div>
                  <div>
                    <p className="agenda-title">Start at the pool</p>
                    <p className="agenda-copy">Beer, BBQ, swimming, sun and chill.</p>
                  </div>
                </div>
                <div className="agenda-item">
                  <div className="time">18:30</div>
                  <div>
                    <p className="agenda-title">Welcome drinks</p>
                    <p className="agenda-copy">Cocktails and good mood.</p>
                  </div>
                </div>
                <div className="agenda-item">
                  <div className="time">19:00</div>
                  <div>
                    <p className="agenda-title">DJ set</p>
                    <p className="agenda-copy">Music, dancing and the proper goodbye vibe.</p>
                  </div>
                </div>
                <div className="agenda-item">
                  <div className="time">23:30</div>
                  <div>
                    <p className="agenda-title">Finish</p>
                    <p className="agenda-copy">One last cheers before the next chapter.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="card rsvp" aria-labelledby="rsvp-title">
          <div className="rsvp-head">
            <div>
              <h2 id="rsvp-title">RSVP</h2>
              <p>Tell me now: are you coming or not?</p>
            </div>
            <p>Guests are welcome.</p>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="status-grid" role="radiogroup" aria-label="Attendance status">
              <label className="radio-card">
                <input
                  type="radio"
                  name="status"
                  value="coming"
                  checked={status === "coming"}
                  onChange={() => setStatus("coming")}
                />
                <span>Yes, I&apos;ll be there.</span>
              </label>

              <label className="radio-card">
                <input
                  type="radio"
                  name="status"
                  value="not_coming"
                  checked={status === "not_coming"}
                  onChange={() => setStatus("not_coming")}
                />
                <span>Sorry, I can&apos;t make it.</span>
              </label>
            </div>

            <div className="fields">
              <div className="field">
                <label htmlFor="name">Your name</label>
                <input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Name Surname"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="guests">Number of guests</label>
                <input
                  id="guests"
                  value={guests}
                  onChange={(event) => setGuests(event.target.value)}
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="99"
                  required
                />
              </div>
            </div>

            <label className="honeypot" htmlFor="company">Company</label>
            <input
              className="honeypot"
              id="company"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />

            <button className="submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Submit RSVP"}
            </button>

            <div className={`message ${messageType}`} role="status" aria-live="polite">
              {message}
            </div>
          </form>
        </section>

        <p className="footer-note">Thank you for being part of this journey. See you on July 11.</p>
      </div>
    </main>
  );
}
