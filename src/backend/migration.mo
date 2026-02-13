module {
  type Actor = { loveLetter : Text };

  public func run(old : Actor) : Actor {
    { old with loveLetter = "" };
  };
};
