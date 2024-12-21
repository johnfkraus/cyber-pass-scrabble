{pkgs}: {
  deps = [
    pkgs.openssh
    pkgs.geolite-legacy
    pkgs.postgresql
    pkgs.openssl
  ];
}
