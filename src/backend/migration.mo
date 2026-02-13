module {
  type OldActor = {
    loveLetterTemplate : Text;
  };

  type NewActor = {
    loveLetterTemplate : Text;
  };

  let correctLoveLetterText = "My beloved Marianne,\n\nFor the longest time, I was filled with memories from a previous relationship. These memories used to cloud my present. But one day that changed. At some point, I realized that I was no longer thinking about Marina. Every time we spend time together, every time we just watch TV, I feel like I fall more and more in love with you. Now, even cloudy days become the brightest, happiest, and most serene time of my day, because I get to spend it with you. I cherish every moment with you and wouldn't trade it for anything.\n\nIt's been an incredible blessing, and I want to thank you.\n\nI love you more than anything, more than anyone else could ever understand. If you still ask me \"Do you love me?\", in my opinion, it's in the running for \"Best rhetorical question of the year.\"\n\nIt's funny how things work. What you may not realize is that even just being with you, by your side, makes me feel valiant, strong, worthy, and loved. You give me a sense of purpose in my life.\n\nAll I want is for us to be together and become even more connected to each other. I want us to explore all nuances of love and discover the depths of our emotional bond so that our souls become the most intense and profound reflection of each other. A loving partnership can transcend all boundaries, giving people a second chance to live a deeply meaningful life—Emotionally, spiritually, and physically a fulfilling, passionate union that we can truly rely on. Especially when it gets hard ❤️.\n\nBest,\nNikita";

  // Old/wrong default
  let wrongLoveLetterText = "dear familiy,\n\nThank you for welcoming me so warmly into your life.\n\nI never expected to live such a fortunate life in such a wonderful family alongside my wonderful wife.\n\nYou are all very polite, very caring and lovely people. In this light, I thank you deeply for providing me a beautiful life.\n\nI hope you are enjoying this Valentine's day.\n\nBest,\nNikita❤️\n\nHistory: This is me trying to impress you with a custom IC smart contract 🙏.\n\n(I made an even more special card for my Marianne et ✔)";

  public func run(old : OldActor) : NewActor {
    let fixedLoveLetter =
      if (old.loveLetterTemplate == wrongLoveLetterText) { correctLoveLetterText } else {
        old.loveLetterTemplate;
      };
    { loveLetterTemplate = fixedLoveLetter };
  };
};

