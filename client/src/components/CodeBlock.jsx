export default function CodeBlock({ code }) {
  return (
    <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 overflow-x-auto text-sm text-green-400">
      <code>{code}</code>
    </pre>
  );
}