import {
  Box,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import {
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { FaFacebookF, FaXTwitter, FaYoutube } from "react-icons/fa6";

const footerNavigation = [
  {
    title: "Alışveriş",
    items: [
      { name: "Kadın", href: "/women" },
      { name: "Erkek", href: "/man" },
      { name: "Aksesuar", href: "/accessories" },
      { name: "Yeni Ürünler", href: "/new-products" },
      { name: "İndirimler", href: "/sales" },
    ],
  },
  {
    title: "Kurumsal",
    items: [
      { name: "Hakkımızda", href: "#" },
      { name: "İletişim", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Kariyer", href: "#" },
    ],
  },
  {
    title: "Yardım",
    items: [
      { name: "Kargo ve Teslimat", href: "#" },
      { name: "İade ve Değişim", href: "#" },
      { name: "Gizlilik Politikası", href: "#" },
      { name: "Kullanım Şartları", href: "#" },
    ],
  },
];

const socialLinks = [
  { name: "Instagram", href: "#", icon: FiInstagram },
  { name: "Facebook", href: "#", icon: FaFacebookF },
  { name: "X", href: "#", icon: FaXTwitter },
  { name: "YouTube", href: "#", icon: FaYoutube },
];

export default function NewsletterFooter() {
  return (
    <Box component="footer" className="bg-[#F7F4EE] text-[#1C1917]">
      <Box
        component="hr"
        aria-hidden="true"
        className="mx-auto max-w-9xl border-0 border-t border-[#C8BBAA]"
      />

      <Container maxWidth="lg" className="py-[22px] pb-[30px]">
        <Grid container columnSpacing={{ xs: 3, md: 4 }} rowSpacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              className="!font-serif !font-bold !text-[#1C1917]"
            >
              ShopSphere
            </Typography>
            <Typography
              variant="body2"
              className="!mt-0.5 !text-[#57534E]"
            >
              Zamanın stili, her zaman seninle.
            </Typography>
            <Stack direction="row" spacing={1} className="mt-2.5">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <Link
                  key={name}
                  href={href}
                  aria-label={name}
                  className="inline-flex size-8 items-center justify-center !text-black transition-colors duration-150 hover:!text-[#57534E]"
                >
                  <Icon size={17} />
                </Link>
              ))}
            </Stack>
          </Grid>

          {footerNavigation.map(({ title, items }) => (
            <Grid size={{ xs: 6, sm: 3, md: 2 }} key={title}>
              <Typography
                variant="subtitle2"
                className="mb-1 !font-bold !text-[#1C1917]"
              >
                {title}
              </Typography>
              <Stack className="flex flex-col gap-0.5">
                {items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    underline="none"
                    variant="body2"
                    className="!text-[#57534E] transition-colors duration-150 hover:!text-[#1C1917]"
                  >
                    {item.name}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="subtitle2"
              className="mb-1 !font-bold !text-[#1C1917]"
            >
              İletişim
            </Typography>
            <Stack className="flex flex-col gap-0.75">
              <Link
                href="mailto:info@shopsphere.com"
                underline="none"
                className="flex items-center gap-2 text-sm !text-[#57534E] transition-colors duration-150 hover:!text-[#1C1917] [&>svg]:shrink-0"
              >
                <FiMail aria-hidden="true" />
                <span>info@shopsphere.com</span>
              </Link>
              <Link
                href="tel:+905551234567"
                underline="none"
                className="flex items-center gap-2 text-sm !text-[#57534E] transition-colors duration-150 hover:!text-[#1C1917] [&>svg]:shrink-0"
              >
                <FiPhone aria-hidden="true" />
                <span>+90 555 123 45 67</span>
              </Link>
              <Box className="flex items-center gap-2 text-sm text-[#57534E] [&>svg]:shrink-0">
                <FiMapPin aria-hidden="true" />
                <span>İstanbul, Türkiye</span>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
