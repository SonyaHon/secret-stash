import React from "react";
import { observer } from "mobx-react";
import {
  Alignment,
  Button,
  InputGroup,
  Intent,
  Navbar,
} from "@blueprintjs/core";
import { Link } from "react-router-dom";
import { AppRoutes } from "../store/model";
import { useCurrentRoute } from "../hooks/use-current-route";

export const AppNavbar: React.FC = observer(() => {
  const route = useCurrentRoute();
  const getIntent = (r: string) => {
    return route === r ? Intent.PRIMARY : Intent.NONE;
  };

  let searchTarget;
  switch (route) {
    case "videos":
      searchTarget = "videos";
      break;
    case "actors":
      searchTarget = "actors";
      break;
    case "collections":
      searchTarget = "collections";
      break;
    default:
      searchTarget = "videos";
      break;
  }

  return (
    <Navbar className="bp3-dark app-navbar">
      <Navbar.Group>
        <Navbar.Heading>Secret Stash</Navbar.Heading>
      </Navbar.Group>
      <Navbar.Group className="app-navbar-search-container">
        <InputGroup
          placeholder={`Search ${searchTarget}...`}
          className="search"
          leftIcon="search"
          rightElement={<Button minimal icon="arrow-right" />}
        />
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <Link to={AppRoutes.videos()}>
          <Button
            intent={getIntent("videos")}
            minimal
            large
            icon="mobile-video"
          />
        </Link>
        <Link to={AppRoutes.actors()}>
          <Button intent={getIntent("actors")} minimal large icon="person" />
        </Link>
        <Link to={AppRoutes.collections()}>
          <Button
            intent={getIntent("collections")}
            minimal
            large
            icon="database"
          />
        </Link>
        <Button className="mobile-search" minimal large icon="search" />
      </Navbar.Group>
    </Navbar>
  );
});
