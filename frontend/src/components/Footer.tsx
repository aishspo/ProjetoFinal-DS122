import { GithubIcon } from "@/assets/GithubIcon";
import { Button } from "./ui/button";

export const Footer = () => {
  return (
    <footer className="sticky top-[100vh] flex flex-row justify-evenly p-4 items-center">
      <small>© 2024 Copyright</small>
      <Button variant={"link"} size={"icon"}>
        <a href="https://github.com/" target="_blank">
          <GithubIcon />
        </a>
      </Button>
    </footer>
  );
};
