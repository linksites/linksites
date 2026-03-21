import type { AppLocale } from "@/lib/locale";

export const appContent: Record<AppLocale, {
  lang: string;
  metadata: {
    title: string;
    description: string;
  };
  shared: {
    connected: string;
    mockMode: string;
    continueDashboard: string;
    signIn: string;
    signOut: string;
    createAccount: string;
    backHome: string;
    languageLabel: string;
    previewOpen: string;
    locales: Array<{
      value: AppLocale;
      label: string;
    }>;
  };
  home: {
    subtitle: string;
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    features: Array<{
      title: string;
      text: string;
    }>;
    showcaseEyebrow: string;
    showcaseTitle: string;
    showcaseDescription: string;
    showcaseBadges: string[];
    showcaseOfficialLabel: string;
    showcaseLinksLabel: string;
    showcaseStatusLabel: string;
    showcaseStatusLive: string;
    showcaseStatusSetup: string;
    roadmapEyebrow: string;
    roadmapTitle: string;
    roadmapDescription: string;
    roadmapFootnote: string;
    milestones: string[];
  };
  login: {
    eyebrow: string;
    title: string;
    description: string;
    signInCard: string;
    signUpCard: string;
    magicTitle: string;
    magicDescription: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    signupPasswordPlaceholder: string;
    signInButton: string;
    signUpButton: string;
    magicButton: string;
    backHome: string;
    productEyebrow: string;
    productTitle: string;
    bullets: string[];
    feedback: Record<string, string>;
  };
  dashboard: {
    eyebrow: string;
    title: string;
    description: string;
    editorDescription: string;
    sessionLabel: string;
    sessionAuthenticated: string;
    sessionFallback: string;
    sessionFallbackDescription: string;
    profileStatusLabel: string;
    profilePublished: string;
    profileDraft: string;
    profilePublishedDescription: string;
    profileDraftDescription: string;
    unlockedLabel: string;
    unlockedSuffix: string;
    unlockedDescription: string;
    publicCardLabel: string;
    publicCardTitle: string;
    publicCardPublished: string;
    publicCardDraft: string;
    publicCardDescriptionPublished: string;
    publicCardDescriptionDraft: string;
    publicCardUrlLabel: string;
    publicCardOpen: string;
    identityLabel: string;
    identityTitle: string;
    identityLive: string;
    identityFallback: string;
    analyticsLabel: string;
    analyticsTitle: string;
    analyticsDescription: string;
    analyticsViewsLabel: string;
    analyticsVisitorsLabel: string;
    analyticsClicksLabel: string;
    analyticsRecentViewsLabel: string;
    analyticsTopLinkLabel: string;
    analyticsTopLinkEmpty: string;
    onboardingLabel: string;
    onboardingTitle: string;
    onboardingDescription: string;
    onboardingCompletedLabel: string;
    onboardingStepDone: string;
    onboardingStepPending: string;
    onboardingSteps: Record<"profile" | "bio" | "avatar" | "links" | "publish", string>;
    discovery: {
      label: string;
      title: string;
      description: string;
      profileSingular: string;
      profilePlural: string;
      followerSingular: string;
      followerPlural: string;
      linkSingular: string;
      linkPlural: string;
      openProfile: string;
      emptyBio: string;
      emptyTitle: string;
      emptyDescription: string;
    };
    fields: {
      displayName: string;
      username: string;
      bio: string;
      avatarUrl: string;
      links: string;
      theme: string;
      visibility: string;
    };
    themeOptions: Record<string, string>;
    visibilityDraft: string;
    visibilityPublished: string;
    saveButton: string;
    avatarUpload: string;
    avatarUploadHint: string;
    avatarRemove: string;
    linksDescription: string;
    linkTitle: string;
    linkUrl: string;
    linkPosition: string;
    linkStatus: string;
    linkRemove: string;
    linkNew: string;
    linkInactiveHint: string;
    addLinkHint: string;
    saveLinksButton: string;
    mockReadonly: string;
    linkActive: string;
    linkInactive: string;
    emptyLinks: string;
    nextStep: string;
    pendingProfileName: string;
    pendingProfileBio: string;
    feedback: Record<string, string>;
  };
  publicProfile: {
    backHome: string;
    followersSingular: string;
    followersPlural: string;
  };
  notFound: {
    title: string;
    description: string;
    cta: string;
  };
}> = {
  ptBR: {
    lang: "pt-BR",
    metadata: {
      title: "LinkSites App | Área do produto e mini sites",
      description:
        "Camada SaaS do LinkSites para páginas de criador, bio links premium e mini sites profissionais.",
    },
    shared: {
      connected: "Supabase conectado",
      mockMode: "Modo mock",
      continueDashboard: "Continuar para o dashboard",
      signIn: "Entrar",
      signOut: "Sair",
      createAccount: "Criar conta",
      backHome: "Voltar para a home do app",
      languageLabel: "Idioma",
      previewOpen: "Abrir",
      locales: [
        { value: "ptBR", label: "PT-BR" },
        { value: "en", label: "EN" },
      ],
    },
    home: {
      subtitle: "Camada SaaS para páginas de criador e mini sites premium.",
      eyebrow: "MVP estilo Linktree",
      title: "Páginas de criador com identidade mais forte, conversão direta e espaço para evoluir para um mini site completo.",
      description:
        "Este app é a próxima camada de produto do LinkSites. A ideia é simples: permitir que criadores, especialistas e negócios locais publiquem uma página profissional em minutos e evoluam isso com o tempo.",
      primaryCta: "Criar conta",
      secondaryCta: "Ver perfil público",
      features: [
        {
          title: "Construtor de perfil",
          text: "Monte uma página premium com avatar, bio, links diretos e identidade visual em um fluxo compacto de edição.",
        },
        {
          title: "Usernames públicos",
          text: "Publique cada página em uma rota limpa como /u/sergio e evolua depois para domínios personalizados.",
        },
        {
          title: "Pronto para Supabase",
          text: "Auth, Postgres, Storage e RLS já se encaixam na direção do produto para o MVP e para a evolução.",
        },
      ],
      showcaseEyebrow: "Conta oficial em destaque",
      showcaseTitle: "A própria LinkSites em formato de árvore de links",
      showcaseDescription:
        "Use esta área como vitrine viva da conta da empresa. Ela pode ser atualizada como qualquer outro perfil e funciona como demonstração real do produto para novos clientes.",
      showcaseBadges: ["Conta oficial", "Perfil divulgável", "Demo viva do produto"],
      showcaseOfficialLabel: "Perfil oficial",
      showcaseLinksLabel: "Links ativos",
      showcaseStatusLabel: "Status",
      showcaseStatusLive: "Ao vivo",
      showcaseStatusSetup: "Em configuração",
      roadmapEyebrow: "Roadmap",
      roadmapTitle: "O que esta base já prepara",
      roadmapDescription:
        "A estrutura foi separada para manter o trabalho de produto organizado: dashboard, página pública, modelo de dados e integrações com Supabase já estão prontos para a próxima fase.",
      roadmapFootnote: "Esse marco está na fila para manter o MVP pequeno e focado no produto.",
      milestones: [
        "Autenticação e onboarding",
        "Links editáveis com persistência",
        "Temas e personalização de marca",
        "Analytics e rastreamento de cliques",
      ],
    },
    login: {
      eyebrow: "Acessar o LinkSites",
      title: "Entre e acesse seu espaço de criador",
      description:
        "Este é o primeiro ponto de entrada real do SaaS. Entre, crie sua conta ou use um magic link para acessar o dashboard com menos burocracia.",
      signInCard: "Entrar com senha",
      signUpCard: "Criar conta",
      magicTitle: "Prefere um magic link?",
      magicDescription:
        "Digite seu e-mail e receba um link seguro de acesso. Isso ajuda quando o usuário foi criado por convite e ainda não definiu senha.",
      emailLabel: "E-mail",
      emailPlaceholder: "você@exemplo.com",
      passwordLabel: "Senha",
      passwordPlaceholder: "Sua senha",
      signupPasswordPlaceholder: "Crie uma senha",
      signInButton: "Entrar",
      signUpButton: "Criar minha conta",
      magicButton: "Enviar magic link",
      backHome: "Voltar para a visão geral do produto",
      productEyebrow: "Dentro do produto",
      productTitle: "O que um criador conectado vai sentir",
      bullets: [
        "Um dashboard privado ligado a uma conta real",
        "Um status claro de página publicada ou rascunho",
        "Uma noção visível de recursos liberados e próximos passos",
        "Uma rota pública ao vivo ligada ao perfil salvo",
      ],
      feedback: {
        missing_credentials: "Informe seu e-mail e sua senha para continuar.",
        missing_signup_credentials: "Informe seu e-mail e sua senha para criar sua conta.",
        missing_magic_email: "Informe seu e-mail para receber um magic link.",
        could_not_sign_in: "Não foi possível entrar com essas credenciais.",
        could_not_sign_up: "Não foi possível criar sua conta agora.",
        could_not_send_magic_link: "Não foi possível enviar o magic link agora.",
        signup_confirmation_email_failed: "Não foi possível enviar o e-mail de confirmação. Se o SMTP customizado estiver desligado, o Supabase costuma limitar esse envio a e-mails do time do projeto e a uma cota bem baixa.",
        signup_email_registered: "Este e-mail já está cadastrado. Tente entrar ou usar o magic link.",
        signup_invalid_email: "Esse e-mail parece inválido. Revise o endereço digitado e tente de novo.",
        signup_weak_password: "Sua senha está fraca. Use pelo menos 6 caracteres e tente novamente.",
        signup_disabled: "O cadastro por e-mail está desativado neste momento. Tente novamente mais tarde.",
        signup_rate_limited: "Você tentou criar contas muitas vezes em pouco tempo. Aguarde um pouco e tente novamente.",
        login_invalid_credentials: "E-mail ou senha incorretos, ou sua conta ainda não foi confirmada por e-mail.",
        login_rate_limited: "Muitas tentativas de login em pouco tempo. Aguarde um pouco e tente novamente.",
        magic_confirmation_email_failed: "Não foi possível enviar o magic link. O provedor de e-mail do projeto recusou o envio ou o serviço padrão do Supabase atingiu o limite.",
        magic_invalid_email: "Esse e-mail parece inválido. Revise o endereço digitado para receber o magic link.",
        magic_disabled: "O envio por e-mail está desativado neste momento. Tente novamente mais tarde.",
        magic_rate_limited: "Muitos e-mails enviados em pouco tempo. Aguarde um pouco antes de tentar de novo.",
        check_email: "Confira seu e-mail para confirmar sua conta.",
        magic_link_sent: "Magic link enviado. Verifique sua caixa de entrada.",
        signed_out: "Você saiu com sucesso.",
        verify_link_failed: "Não foi possível validar esse link de e-mail.",
        sign_in_required: "Entre para acessar seu dashboard de criador.",
      },
    },
    dashboard: {
      eyebrow: "Dashboard MVP",
      title: "Bem-vindo de volta, {name}",
      description:
        "Sua conta agora está conectada à camada de produto. Este dashboard já reflete a sessão real e pode evoluir para edição, analytics, planos e controles de publicação.",
      editorDescription: "Atualize os dados centrais da sua página e salve direto no banco real.",
      sessionLabel: "Sessão",
      sessionAuthenticated: "Autenticado",
      sessionFallback: "Modo mock",
      sessionFallbackDescription: "Usando a conta local de fallback enquanto o Supabase não estiver disponível.",
      profileStatusLabel: "Status do perfil",
      profilePublished: "Publicado",
      profileDraft: "Rascunho",
      profilePublishedDescription: "Sua página pública já pode ser acessada em /u/{username}.",
      profileDraftDescription: "Publique este perfil quando quiser colocar sua página no ar.",
      unlockedLabel: "Liberado",
      unlockedSuffix: "serviços ativos",
      unlockedDescription: "Perfil público, pilha de links, tema visual e acesso protegido ao dashboard já estão conectados.",
      publicCardLabel: "Link de apresentação",
      publicCardTitle: "Sua árvore de links pública",
      publicCardPublished: "Pronto para divulgar",
      publicCardDraft: "Aguardando publicação",
      publicCardDescriptionPublished: "Seu perfil já pode ser compartilhado com qualquer pessoa como um link de apresentação.",
      publicCardDescriptionDraft: "Ative a publicação do perfil para transformar sua página em um link público para divulgação.",
      publicCardUrlLabel: "URL pública",
      publicCardOpen: "Abrir página pública",
      identityLabel: "Identidade do criador",
      identityTitle: "Informações do perfil vindas da sua conta",
      identityLive: "Ao vivo no Supabase",
      identityFallback: "Dados de fallback",
      analyticsLabel: "Analytics",
      analyticsTitle: "Como sua página está performando",
      analyticsDescription: "Acompanhe visitas, visitantes únicos e cliques para entender o que mais atrai interesse no seu perfil.",
      analyticsViewsLabel: "Visualizações",
      analyticsVisitorsLabel: "Visitantes únicos",
      analyticsClicksLabel: "Cliques em links",
      analyticsRecentViewsLabel: "Visualizações nos últimos 7 dias",
      analyticsTopLinkLabel: "Link com mais cliques",
      analyticsTopLinkEmpty: "Ainda sem cliques",
      onboardingLabel: "Onboarding",
      onboardingTitle: "Checklist para publicar melhor",
      onboardingDescription: "Complete estas etapas para deixar seu perfil mais forte, mais confiável e pronto para divulgar.",
      onboardingCompletedLabel: "etapas concluídas",
      onboardingStepDone: "OK",
      onboardingStepPending: "Pendente",
      onboardingSteps: {
        profile: "Definir nome e username",
        bio: "Escrever uma bio clara",
        avatar: "Adicionar avatar",
        links: "Publicar pelo menos 3 links ativos",
        publish: "Ativar a página pública",
      },
      discovery: {
        label: "Rede",
        title: "Perfis publicados na rede",
        description: "Veja outros perfis públicos já criados no LinkSites e abra rapidamente as páginas que estão ativas.",
        profileSingular: "perfil",
        profilePlural: "perfis",
        followerSingular: "seguidor",
        followerPlural: "seguidores",
        linkSingular: "link ativo",
        linkPlural: "links ativos",
        openProfile: "Ver perfil",
        emptyBio: "Este perfil ainda não adicionou uma bio pública.",
        emptyTitle: "Ainda não existem outros perfis publicados",
        emptyDescription: "Assim que novos usuários publicarem suas páginas, esta área vai começar a mostrar a rede ativa.",
      },
      fields: {
        displayName: "Nome de exibição",
        username: "Username",
        bio: "Bio",
        avatarUrl: "Avatar (URL)",
        links: "Links",
        theme: "Tema visual",
        visibility: "Publicação",
      },
      themeOptions: {
        "midnight-grid": "Midnight Grid",
        "sunset-signal": "Sunset Signal",
      },
      visibilityDraft: "Manter como rascunho",
      visibilityPublished: "Publicar página",
      saveButton: "Salvar perfil",
      avatarUpload: "Enviar nova foto",
      avatarUploadHint: "Formatos aceitos: JPG, PNG, WEBP, GIF ou AVIF com até 5 MB.",
      avatarRemove: "Remover avatar atual",
      linksDescription: "Edite os links públicos, reorganize a ordem, desative o que não quiser mostrar e adicione novos botões.",
      linkTitle: "Título",
      linkUrl: "URL",
      linkPosition: "Ordem",
      linkStatus: "Status",
      linkRemove: "Remover",
      linkNew: "Novo link",
      linkInactiveHint: "Desative para esconder este botão da página pública.",
      addLinkHint: "Preencha título e URL para criar um novo link.",
      saveLinksButton: "Salvar links",
      mockReadonly: "O modo mock não salva alterações. Conecte o Supabase para editar o perfil real.",
      linkActive: "Ativo",
      linkInactive: "Inativo",
      emptyLinks: "Ainda não existem links. Use o bloco abaixo para criar seus primeiros botões públicos.",
      nextStep:
        "Próximo passo de implementação: adicionar onboarding guiado, analytics de cliques e mais blocos de conteúdo para transformar a página em mini site.",
      pendingProfileName: "Novo criador",
      pendingProfileBio:
        "Sua conta está autenticada, mas o registro do perfil ainda precisa ser criado ou vinculado corretamente no banco de dados.",
      feedback: {
        profile_saved: "Perfil salvo com sucesso.",
        links_saved: "Links salvos com sucesso.",
        profile_save_failed: "Não foi possível salvar o perfil agora.",
        links_save_failed: "Não foi possível salvar os links agora.",
        username_taken: "Esse username já está em uso. Tente outro.",
        invalid_username: "Use um username entre 3 e 32 caracteres com letras minúsculas, números e hífens.",
        invalid_display_name: "Informe um nome de exibição para salvar o perfil.",
        invalid_avatar_url: "Use uma URL válida para o avatar ou deixe o campo vazio.",
        invalid_avatar_file: "Envie uma imagem válida de até 5 MB para o avatar.",
        avatar_upload_failed: "Não foi possível enviar a foto de perfil agora.",
        invalid_link_title: "Cada link precisa ter um título antes de salvar.",
        invalid_link_url: "Cada link precisa usar uma URL válida com http:// ou https://.",
        post_saved: "Post publicado com sucesso.",
        post_deleted: "Post removido com sucesso.",
        post_save_failed: "Não foi possível publicar esse post agora.",
        post_delete_failed: "Não foi possível remover esse post agora.",
        invalid_post_content: "Escreva um texto antes de publicar o post.",
        invalid_post_length: "O post precisa ter no máximo 280 caracteres.",
        unauthorized: "Entre novamente para continuar editando seu perfil.",
        mock_mode_readonly: "O modo mock não permite salvar alterações reais.",
      },
    },
    publicProfile: {
      backHome: "Voltar para o Dashboard",
      followersSingular: "seguidor",
      followersPlural: "seguidores",
    },
    notFound: {
      title: "Este perfil ainda não existe",
      description:
        "Quando o SaaS estiver totalmente conectado à autenticação e persistência, esta rota vai resolver páginas públicas reais de criadores.",
      cta: "Voltar para a home do app",
    },
  },
  en: {
    lang: "en",
    metadata: {
      title: "LinkSites App | Product area and mini sites",
      description:
        "The LinkSites SaaS layer for creator pages, premium bio links, and professional mini sites.",
    },
    shared: {
      connected: "Supabase connected",
      mockMode: "Mock mode",
      continueDashboard: "Continue to dashboard",
      signIn: "Sign in",
      signOut: "Sign out",
      createAccount: "Create account",
      backHome: "Back to app home",
      languageLabel: "Language",
      previewOpen: "Open",
      locales: [
        { value: "ptBR", label: "PT-BR" },
        { value: "en", label: "EN" },
      ],
    },
    home: {
      subtitle: "SaaS layer for creator pages and premium mini sites.",
      eyebrow: "Linktree-style MVP",
      title: "Creator pages with stronger branding, direct conversion, and room to become a full mini site.",
      description:
        "This app is the next product layer for LinkSites. The goal is simple: let creators, specialists, and local businesses publish a professional page in minutes and evolve it over time.",
      primaryCta: "Create account",
      secondaryCta: "View public profile",
      features: [
        {
          title: "Profile builder",
          text: "Create a premium page with avatar, bio, direct links, and visual identity in a compact editor flow.",
        },
        {
          title: "Public usernames",
          text: "Publish each page under a clean public route like /u/sergio and evolve later into custom domains.",
        },
        {
          title: "Supabase ready",
          text: "Auth, Postgres, Storage, and RLS already fit the product direction for the MVP and beyond.",
        },
      ],
      showcaseEyebrow: "Official account spotlight",
      showcaseTitle: "LinkSites itself presented as a link tree",
      showcaseDescription:
        "Use this area as a live showcase of the company account. It can be updated like any other profile and works as a real product demo for new clients.",
      showcaseBadges: ["Official account", "Shareable profile", "Live product demo"],
      showcaseOfficialLabel: "Official profile",
      showcaseLinksLabel: "Active links",
      showcaseStatusLabel: "Status",
      showcaseStatusLive: "Live",
      showcaseStatusSetup: "Setting up",
      roadmapEyebrow: "Roadmap",
      roadmapTitle: "What this starter already prepares",
      roadmapDescription:
        "The base is split to keep product work clean: dashboard, public page, data model, and Supabase integration points are ready for the next iteration.",
      roadmapFootnote: "This milestone is intentionally queued to keep the MVP small and product focused.",
      milestones: [
        "Auth and onboarding",
        "Editable links with persistence",
        "Theme presets and brand customization",
        "Analytics and click tracking",
      ],
    },
    login: {
      eyebrow: "Access LinkSites",
      title: "Sign in and enter your creator workspace",
      description:
        "This is the first real entry point of the SaaS. Sign in, create your account, or use a magic link to access your dashboard with less bureaucracy.",
      signInCard: "Sign in with password",
      signUpCard: "Create account",
      magicTitle: "Prefer a magic link?",
      magicDescription:
        "Enter your email and receive a secure sign-in link. This helps when a user was created by invitation and has not set a password yet.",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Your password",
      signupPasswordPlaceholder: "Create a password",
      signInButton: "Sign in",
      signUpButton: "Create my account",
      magicButton: "Send magic link",
      backHome: "Back to product overview",
      productEyebrow: "Inside the product",
      productTitle: "What a signed-in creator will feel",
      bullets: [
        "A private dashboard linked to a real account",
        "A published or draft status for the page",
        "A clear sense of unlocked features and next actions",
        "A live public route tied to the stored profile",
      ],
      feedback: {
        missing_credentials: "Enter your email and password to continue.",
        missing_signup_credentials: "Enter your email and password to create your account.",
        missing_magic_email: "Enter your email to receive a magic link.",
        could_not_sign_in: "We could not sign you in with those credentials.",
        could_not_sign_up: "We could not create your account right now.",
        could_not_send_magic_link: "We could not send the magic link right now.",
        signup_confirmation_email_failed: "We could not send the confirmation email. If custom SMTP is disabled, Supabase usually limits this flow to project team emails and a very small quota.",
        signup_email_registered: "This email is already registered. Try signing in or using a magic link.",
        signup_invalid_email: "This email looks invalid. Review the address and try again.",
        signup_weak_password: "Your password is too weak. Use at least 6 characters and try again.",
        signup_disabled: "Email signups are currently disabled. Please try again later.",
        signup_rate_limited: "Too many signup attempts in a short time. Wait a bit and try again.",
        login_invalid_credentials: "Your email or password is incorrect, or your account has not been confirmed yet.",
        login_rate_limited: "Too many login attempts in a short time. Wait a bit and try again.",
        magic_confirmation_email_failed: "We could not send the magic link. The project's email provider rejected the delivery or the default Supabase service hit its limit.",
        magic_invalid_email: "This email looks invalid. Review the address before requesting a magic link.",
        magic_disabled: "Email delivery is currently disabled. Please try again later.",
        magic_rate_limited: "Too many email requests in a short time. Wait a bit before trying again.",
        check_email: "Check your email to confirm your account.",
        magic_link_sent: "Magic link sent. Check your inbox.",
        signed_out: "Signed out successfully.",
        verify_link_failed: "We could not verify that email link.",
        sign_in_required: "Sign in to access your creator dashboard.",
      },
    },
    dashboard: {
      eyebrow: "Dashboard MVP",
      title: "Welcome back, {name}",
      description:
        "Your account is now connected to the product layer. This dashboard already reflects real session state and can grow into editing, analytics, plans, and publishing controls.",
      editorDescription: "Update the core details of your page and save them directly to the real database.",
      sessionLabel: "Session",
      sessionAuthenticated: "Authenticated",
      sessionFallback: "Mock mode",
      sessionFallbackDescription: "Using the local fallback account while Supabase is unavailable.",
      profileStatusLabel: "Profile status",
      profilePublished: "Published",
      profileDraft: "Draft",
      profilePublishedDescription: "Your public page can already be visited at /u/{username}.",
      profileDraftDescription: "Publish this profile when you want the public page to go live.",
      unlockedLabel: "Unlocked",
      unlockedSuffix: "active services",
      unlockedDescription: "Public profile, link stack, visual theme, and protected dashboard access are already connected.",
      publicCardLabel: "Presentation link",
      publicCardTitle: "Your public link tree",
      publicCardPublished: "Ready to share",
      publicCardDraft: "Waiting for publication",
      publicCardDescriptionPublished: "Your profile can already be shared with anyone as a presentation link.",
      publicCardDescriptionDraft: "Turn profile publication on to transform your page into a public shareable link.",
      publicCardUrlLabel: "Public URL",
      publicCardOpen: "Open public page",
      identityLabel: "Creator identity",
      identityTitle: "Profile information from your account",
      identityLive: "Live from Supabase",
      identityFallback: "Fallback data",
      analyticsLabel: "Analytics",
      analyticsTitle: "How your page is performing",
      analyticsDescription: "Track views, unique visitors, and link clicks to understand what gets the most attention on your profile.",
      analyticsViewsLabel: "Views",
      analyticsVisitorsLabel: "Unique visitors",
      analyticsClicksLabel: "Link clicks",
      analyticsRecentViewsLabel: "Views in the last 7 days",
      analyticsTopLinkLabel: "Top link",
      analyticsTopLinkEmpty: "No clicks yet",
      onboardingLabel: "Onboarding",
      onboardingTitle: "Checklist for a stronger launch",
      onboardingDescription: "Complete these steps to make your profile stronger, clearer, and ready to share.",
      onboardingCompletedLabel: "steps completed",
      onboardingStepDone: "Done",
      onboardingStepPending: "Pending",
      onboardingSteps: {
        profile: "Set display name and username",
        bio: "Write a clear bio",
        avatar: "Add an avatar",
        links: "Publish at least 3 active links",
        publish: "Turn on the public page",
      },
      discovery: {
        label: "Network",
        title: "Published profiles in the network",
        description: "Browse other public profiles already created in LinkSites and open active pages quickly.",
        profileSingular: "profile",
        profilePlural: "profiles",
        followerSingular: "follower",
        followerPlural: "followers",
        linkSingular: "active link",
        linkPlural: "active links",
        openProfile: "View profile",
        emptyBio: "This profile has not added a public bio yet.",
        emptyTitle: "There are no other published profiles yet",
        emptyDescription: "As soon as new users publish their pages, this area will start showing the active network.",
      },
      fields: {
        displayName: "Display name",
        username: "Username",
        bio: "Bio",
        avatarUrl: "Avatar (URL)",
        links: "Links",
        theme: "Visual theme",
        visibility: "Visibility",
      },
      themeOptions: {
        "midnight-grid": "Midnight Grid",
        "sunset-signal": "Sunset Signal",
      },
      visibilityDraft: "Keep as draft",
      visibilityPublished: "Publish page",
      saveButton: "Save profile",
      avatarUpload: "Upload new photo",
      avatarUploadHint: "Accepted formats: JPG, PNG, WEBP, GIF, or AVIF up to 5 MB.",
      avatarRemove: "Remove current avatar",
      linksDescription: "Edit your public links, reorder them, hide what you do not want to show, and add new buttons.",
      linkTitle: "Title",
      linkUrl: "URL",
      linkPosition: "Order",
      linkStatus: "Status",
      linkRemove: "Remove",
      linkNew: "New link",
      linkInactiveHint: "Turn this off to hide the button from your public page.",
      addLinkHint: "Fill in title and URL to create a new link.",
      saveLinksButton: "Save links",
      mockReadonly: "Mock mode does not save changes. Connect Supabase to edit the real profile.",
      linkActive: "Active",
      linkInactive: "Inactive",
      emptyLinks: "No links yet. Use the section below to create your first public buttons.",
      nextStep:
        "Next implementation step: add guided onboarding, click analytics, and richer content blocks so the page can evolve into a mini site.",
      pendingProfileName: "New creator",
      pendingProfileBio:
        "Your account is authenticated, but your profile record still needs to be created or linked correctly in the database.",
      feedback: {
        profile_saved: "Profile saved successfully.",
        links_saved: "Links saved successfully.",
        profile_save_failed: "We could not save your profile right now.",
        links_save_failed: "We could not save your links right now.",
        username_taken: "That username is already taken. Try another one.",
        invalid_username: "Use a username between 3 and 32 characters with lowercase letters, numbers, and hyphens.",
        invalid_display_name: "Enter a display name before saving the profile.",
        invalid_avatar_url: "Use a valid avatar URL or leave the field empty.",
        invalid_avatar_file: "Upload a valid image up to 5 MB for the avatar.",
        avatar_upload_failed: "We could not upload your profile photo right now.",
        invalid_link_title: "Each link needs a title before saving.",
        invalid_link_url: "Each link must use a valid URL with http:// or https://.",
        post_saved: "Post published successfully.",
        post_deleted: "Post removed successfully.",
        post_save_failed: "We could not publish this post right now.",
        post_delete_failed: "We could not remove this post right now.",
        invalid_post_content: "Write something before publishing the post.",
        invalid_post_length: "Posts must be 280 characters or less.",
        unauthorized: "Sign in again to keep editing your profile.",
        mock_mode_readonly: "Mock mode does not allow saving real changes.",
      },
    },
    publicProfile: {
      backHome: "Back to dashboard",
      followersSingular: "follower",
      followersPlural: "followers",
    },
    notFound: {
      title: "This profile does not exist yet",
      description:
        "Once the SaaS is fully connected to auth and persistence, this route will resolve real public creator pages.",
      cta: "Back to app home",
    },
  },
};
