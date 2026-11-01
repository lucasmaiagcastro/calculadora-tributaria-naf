const rateLimit = ({ janelaMs, maximo }) => {
  const acessos = new Map();

  return (req, res, next) => {
    const agora = Date.now();
    const recentes = (acessos.get(req.ip) || []).filter((t) => agora - t < janelaMs);

    if (recentes.length >= maximo) {
      return res.status(429).json({ error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." });
    }

    recentes.push(agora);
    acessos.set(req.ip, recentes);
    return next();
  };
};

module.exports = rateLimit;
