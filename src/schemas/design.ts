export interface VoteDesign {
  id: string;
  imagePath: string;
  description?: string;
  title?: string;
  votes?: number;
  hasVoted?: boolean;
}

export interface DesignVoter {
  id: number;
  userId: number;
  userRole: string;
  name: string;
  email: string;
  phone?: string | null;
  votedAt: string;
}

export interface DesignVotesData {
  design: {
    id: string;
    description: string;
    imagePath: string;
    votes: number;
    totalVoters: number;
  };
  voters: DesignVoter[];
}

export interface DesignFormData {
  description: string;
  image: File | string;
}
