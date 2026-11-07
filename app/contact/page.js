import ContactForm from "../../components/ContactForm";

export const metadata = {
  title: "Inquire Now at Cool Kids The Agency",
  description: "Tell us about your job and we will get back to you. Film and photography for athletes, clubs and brands.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="enq">
      <div className="enq-bar">
        <a href="/" className="brand"><img src="/logo.png" alt="Cool Kids The Agency" /></a>
        <a href="/" className="enq-back">← Back to the work</a>
      </div>
      <div className="enq-wrap">
        <h1>Tell us about <em>the job.</em></h1>
        <p className="enq-sub">A few quick details and it lands straight in our inbox. Takes under a minute.</p>
        <ContactForm />
      </div>
    </main>
  );
}
