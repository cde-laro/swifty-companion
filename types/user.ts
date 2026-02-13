export type DetailsRouteParams = {
  login?: string;
};

export type DetailsScreenProps = {
  route?: {
    params?: DetailsRouteParams;
  };
};

export type Projects = {
  cursus_ids?: number[];
  final_mark?: number | null;
  'validated?': boolean | null;
  project?: { name: string };
  status?: string;
  updated_at?: string;
};

export type Skill = {
  id: number;
  name: string;
  level: number;
};

export type User = {
  login: string;
  displayname?: string;
  email?: string;
  phone?: string;
  cursus_users?: Cursus[];
  image?: { link?: string; versions: { medium?: string } };
  wallet?: number;
  correction_point?: number;
  location?: string | null;
  projects_users?: Projects[];
};

export type Cursus = {
  cursus_id: number;
  user: User;
  skills: Skill[];
  level: number;
};
