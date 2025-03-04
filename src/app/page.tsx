import { messages } from '@/lib/messages';

const Home = () => {
  return (
    <section className="container mt-10 flex flex-col items-center gap-3 text-center md:absolute md:left-1/2 md:top-1/2 md:mt-0 md:-translate-x-1/2 md:-translate-y-1/2">
      <div className="relative w-full max-w-3xl rounded-lg border border-gray-800 bg-black p-4 shadow-lg">
        <div className="mb-4 flex items-center justify-between border-b border-gray-800 pb-2">
          <div className="flex space-x-2">
            <div className="size-3 rounded-full bg-red-500"></div>
            <div className="size-3 rounded-full bg-yellow-500"></div>
            <div className="size-3 rounded-full bg-green-500"></div>
          </div>
          <div className="w-4"></div>
        </div>
        <div className="flex flex-col items-center justify-center p-8">
          <div className="mb-4 animate-pulse">■</div>
          <h1 className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text font-mono text-3xl font-extrabold tracking-tighter text-transparent md:text-4xl">
            {messages.nextjs_starter_template_headline}
          </h1>
          <div className="mt-2 font-mono text-xs text-gray-400">v1.0.0</div>
          <div className="mt-16 w-full text-left">
            <div className="flex items-start font-mono text-sm text-gray-400">
              <span className="mr-2 text-base text-green-400">$</span>
              <span className="text-muted-foreground font-mono text-base">
                {messages.nextjs_starter_template_description}
                <span className="animate-pulse">_</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
