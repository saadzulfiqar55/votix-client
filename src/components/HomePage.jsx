export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col items-center justify-center p-5">
        <h1 className="text-3xl font-bold mb-4">Welcome to Votix!</h1>
        <p className="text-lg">
          Votix is a web app that allows you to create and manage elections and
          vote on them.
        </p>
        <div className="p-4 uppercase font-bold text-center">
          <h2 className="text-3xl mb-10">Final year project</h2>
          <h3 className="mb-5  text-2xl">Created by</h3>
          <ul className="space-y-2">
            <li>Salwa 073117</li>
            <li>Tooba 073139</li>
            <li>Um e Rubab 073109</li>
            <li>Laiba 056504</li>
          </ul>
          <h3 className="mt-5">Project Advisor</h3>
          <p>Dr. Muhammad Asif</p>
          <h4>Abstract of the project</h4>
          <p className="mt-2">
            Votix is an online voting app that makes voting easy and safe. The
            main goal is to let people vote from anywhere and stop cheating or
            double voting. The app is built using the MERN stack. Users can sign
            up, log in, and cast their vote. An admin can create elections, add
            candidates, and see live results. This project will help save time,
            reduce errors, and make the voting process simple, secure, and fair
            for everyone.
          </p>
        </div>
      </div>
    </div>
  );
}
