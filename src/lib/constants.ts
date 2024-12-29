import AcmeLogo from "@/assets/logo-acme.png";
import ApexLogo from "@/assets/logo-apex.png";
import CelestialLogo from "@/assets/logo-celestial.png";
import EchoLogo from "@/assets/logo-echo.png";
import PulseLogo from "@/assets/logo-pulse.png";
import QuantumLogo from "@/assets/logo-quantum.png";
import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-3.png";
import avatar3 from "@/assets/avatar-2.png";
import avatar4 from "@/assets/avatar-4.png";
import { StaticImageData } from "next/image";

export const NavLinks = [
  {
    name: "Features",
    link: "#",
  },
  {
    name: "Developers",
    link: "#",
  },
  {
    name: "Pricing",
    link: "#",
  },
  {
    name: "Changelog",
    link: "#",
  },
];

type SectionType = {
  title: string;
  description?: string;
  cards?: {
    title: string;
    description?: string;
    isNew?: undefined | boolean;
    author?: {
      name: string;
      about: string;
      profile: string;
    };
  }[];
};

type Tabs = {
  icon: string;
  title: string;
  isNew: boolean;
  backgroundPositionX: number;
  backgroundPositionY: number;
  backgroundSizeX: number;
}[];

export const HeroSection: SectionType = {
  title: "AI SEO",
  description:
    "Elevate your site's visibility effortlessly with AI, where smart technology meets user-friendly SEO tools.",
};

export const LogoTickerSection: SectionType = {
  title: "Trusted by top innovative teams",
  description: "",
  cards: [
    {
      title: "acme",
      description: AcmeLogo.src,
    },
    {
      title: "apex",
      description: ApexLogo.src,
    },
    {
      title: "echo",
      description: EchoLogo.src,
    },
    {
      title: "pulse",
      description: PulseLogo.src,
    },
    {
      title: "quantum",
      description: QuantumLogo.src,
    },
    {
      title: "celestial",
      description: CelestialLogo.src,
    },
  ],
};

export const FeaturesSection: SectionType & { tabs: Tabs } = {
  title: "Elevate your SEO efforts.",
  description:
    "From small startups to large enterprises, our AI-driven tool has revolutionized the way businesses approach SEO.",
  tabs: [
    {
      icon: "/assets/lottie/vroom.lottie",
      title: "User-friendly dashboard",
      isNew: false,
      backgroundPositionX: 0,
      backgroundPositionY: 0,
      backgroundSizeX: 150,
    },
    {
      icon: "/assets/lottie/click.lottie",
      title: "One-click optimization",
      isNew: false,
      backgroundPositionX: 98,
      backgroundPositionY: 100,
      backgroundSizeX: 135,
    },
    {
      icon: "/assets/lottie/stars.lottie",
      title: "Smart keyword generator",
      isNew: true,
      backgroundPositionX: 100,
      backgroundPositionY: 27,
      backgroundSizeX: 177,
    },
  ],
};

export const TestimonialSection: SectionType & {
  testimonials: {
    text: string;
    name: string;
    title: string;
    avatarImg: StaticImageData;
  }[];
} = {
  title: "Beyond Expectations.",
  description:
    "Our revolutionary AI SEO tools have transformed our clients' strategies.",
    testimonials : [
      {
        text: "“This product has completely transformed how I manage my projects and deadlines”",
        name: "Sophia Perez",
        title: "Director @ Quantum",
        avatarImg: avatar1,
      },
      {
        text: "“The user interface is so intuitive and easy to use, it has saved us countless hours”",
        name: "Alisa Hester",
        title: "Product @ Innovate",
        avatarImg: avatar2,
      },
      {
        text: "“These AI tools have completely revolutionized our SEO entire strategy overnight”",
        name: "Jamie Lee",
        title: "Founder @ Pulse",
        avatarImg: avatar3,
      },
      {
        text: "“Our team's productivity has increased significantly since we started using this tool”",
        name: "Alec Whitten",
        title: "CTO @ Tech Solutions",
        avatarImg: avatar4,
      },
    ],
};

export const CTASection: SectionType = {
  title: "AI-driven SEO for everyone.",
  description: "Achieve clear, impactful results without the complexity.",
};

export const FAQSection: SectionType = {
  title: "Frequently Answered Questions",
  description: "Achieve clear, impactful results without the complexity.",
  cards: [
    {
      title: "What is AI SEO?",
      description:
        "AI SEO uses artificial intelligence to optimize your website's visibility and improve rankings effortlessly.",
    },
    {
      title: "How does the tool help my business?",
      description:
        "Our AI-powered tools provide actionable insights, automatic keyword generation, and real-time analytics to boost your SEO performance.",
    },
    {
      title: "Can I cancel anytime?",
      description:
        "Absolutely! You can cancel your subscription anytime with no penalties.",
    },
    {
      title: "What support options are available?",
      description:
        "Our support team is available 24/7 via live chat and email for all your queries.",
    },
  ],
};
