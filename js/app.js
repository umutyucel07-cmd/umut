(function(){
function WebSiteApp() {
  const [route, setRoute] = React.useState('home');
  const [legalDoc, setLegalDoc] = React.useState('kvkk');
  const [mevzuatSekme, setMevzuatSekme] = React.useState('araclar');
  const [dil, setDil] = React.useState('tr');
  const [muvekkil, setMuvekkil] = React.useState(() => window.UYOturum ? window.UYOturum.aktif() : null);
  const go = (r, arg) => {
    if (r === 'legal' && arg) setLegalDoc(arg);
    if (r === 'mevzuat' && arg) setMevzuatSekme(arg);
    setRoute(r);
    window.scrollTo(0, 0);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      minWidth: 1180,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    route: route,
    go: go,
    signedIn: !!muvekkil,
    dil: dil,
    setDil: setDil
  }), dil !== 'tr' && window.DilBandi ? /*#__PURE__*/React.createElement(window.DilBandi, {
    dil: dil,
    go: go
  }) : null, window.HizliErisim ? /*#__PURE__*/React.createElement(window.HizliErisim, {
    go: go
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, route === 'home' ? /*#__PURE__*/React.createElement(HomeScreen, {
    go: go
  }) : route === 'booking' ? /*#__PURE__*/React.createElement(BookingScreen, {
    go: go
  }) : route === 'articles' ? /*#__PURE__*/React.createElement(ArticlesScreen, {
    go: go
  }) : route === 'buro' ? /*#__PURE__*/React.createElement(BuroScreen, {
    go: go
  }) : route === 'uygulama' ? /*#__PURE__*/React.createElement(UygulamaScreen, {
    go: go
  }) : route === 'sss' ? /*#__PURE__*/React.createElement(SSSScreen, {
    go: go
  }) : route === 'mevzuat' ? /*#__PURE__*/React.createElement(MevzuatScreen, {
    go: go,
    sekme: mevzuatSekme
  }) : route === 'legal' ? /*#__PURE__*/React.createElement(LegalScreen, {
    go: go,
    doc: legalDoc,
    setDoc: setLegalDoc
  }) : route === 'portal' && muvekkil ? /*#__PURE__*/React.createElement(PortalScreen, {
    go: go,
    muvekkil: muvekkil,
    cikis: () => {
      window.UYOturum && window.UYOturum.cikis();
      setMuvekkil(null);
      go('login');
    }
  }) : /*#__PURE__*/React.createElement(LoginScreen, {
    go: go,
    girisYap: m => {
      setMuvekkil(m);
      go('portal');
    }
  })), /*#__PURE__*/React.createElement(SiteFooter, {
    go: go
  }), /*#__PURE__*/React.createElement(WhatsAppFab, null), /*#__PURE__*/React.createElement(CookieBanner, {
    go: go
  }));
}
if (window.APP_ENTRY === 'web') ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(WebSiteApp, null));
})();
