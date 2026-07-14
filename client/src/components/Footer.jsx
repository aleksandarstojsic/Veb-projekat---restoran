const Footer = ({ restaurantInfo }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <strong>{restaurantInfo.name}</strong>
      <span>{restaurantInfo.address}</span>
      <span>{restaurantInfo.phone}</span>
      <small>&copy; {currentYear} Sedmica. Sva prava zadrzana.</small>
    </footer>
  );
};

export default Footer;
