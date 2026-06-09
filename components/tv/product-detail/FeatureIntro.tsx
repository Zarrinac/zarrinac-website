// Short intro blurb that only renders when copy is provided.
type FeatureIntroProps = {
  title?: string;
  text?: string;
};

const FeatureIntro = ({ title, text }: FeatureIntroProps) => {
  if (!title || !text) return null;

  return (
    <div className="w-full mx-auto max-w-360">
      <div className="text-center ">
        <h2
          className="text-xl font-black text-transparent sm:text-2xl md:text-4xl bg-clip-text md:py-4 2xl:text-6xl"
          style={{ backgroundImage: 'linear-gradient(90deg, #6DEBE6, #00AAA6, #067977)' }}
        >
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-(--text-muted-color) md:mt-4 md:text-base md:leading-8 2xl:text-lg 4xl:text-2xl">
          {text}
        </p>
      </div>
    </div>
  );
};

export default FeatureIntro;
