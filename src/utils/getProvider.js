export const getProvider = () => {
  if ("phantom" in window) {
    let provider = window.phantom?.solana;

    if (provider.isPhantom) {
      return provider;
    }
  }
};
