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
      title: "LinkSites App | Area do produto e mini sites",
      description:
        "Camada SaaS do LinkSites para paginas de criador, bio links premium e mini sites profissionais.",
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
      subtitle: "Camada SaaS para paginas de criador e mini sites premium.",
      eyebrow: "MVP estilo Linktree",
      title: "Paginas de criador com identidade mais forte, conversao direta e espaco para evoluir para um mini site completo.",
      description:
        "Este app e a proxima camada de produto do LinkSites. A ideia e simples: permitir que criadores, especialistas e negocios locais publiquem uma pagina profissional em minutos e evoluam isso com o tempo.",
      primaryCta: "Criar conta",
      secondaryCta: "Ver perfil publico",
      features: [
        {
          title: "Construtor de perfil",
          text: "Monte uma pagina premium com avatar, bio, links diretos e identidade visual em um fluxo compacto de edicao.",
        },
        {
          title: "Usernames publicos",
          text: "Publique cada pagina em uma rota limpa como /u/sergio e evolua depois para dominios personalizados.",
        },
        {
          title: "Pronto para Supabase",
          text: "Auth, Postgres, Storage e RLS ja se encaixam na direcao do produto para o MVP e para a evolucao.",
        },
      ],
      showcaseEyebrow: "Conta oficial em destaque",
      showcaseTitle: "A propria LinkSites em formato de arvore de links",
      showcaseDescription:
        "Use esta area como vitrine viva da conta da empresa. Ela pode ser atualizada como qualquer outro perfil e funciona como demonstracao real do produto para novos clientes.",
      showcaseBadges: ["Conta oficial", "Perfil divulgavel", "Demo viva do produto"],
      showcaseOfficialLabel: "Perfil oficial",
      showcaseLinksLabel: "Links ativos",
      showcaseStatusLabel: "Status",
      showcaseStatusLive: "Ao vivo",
      showcaseStatusSetup: "Em configuracao",
      roadmapEyebrow: "Roadmap",
      roadmapTitle: "O que esta base ja prepara",
      roadmapDescription:
        "A estrutura foi separada para manter o trabalho de produto organizado: dashboard, pagina publica, modelo de dados e integracoes com Supabase ja estao prontos para a proxima fase.",
      roadmapFootnote: "Esse marco esta na fila para manter o MVP pequeno e focado no produto.",
      milestones: [
        "Autenticacao e onboarding",
        "Links editaveis com persistencia",
        "Temas e personalizacao de marca",
        "Analytics e rastreamento de cliques",
      ],
    },
    login: {
      eyebrow: "Acessar o LinkSites",
      title: "Entre e acesse seu espaco de criador",
      description:
        "Este e o primeiro ponto de entrada real do SaaS. Entre, crie sua conta ou use um magic link para acessar o dashboard com menos friccao.",
      signInCard: "Entrar com senha",
      signUpCard: "Criar conta",
      magicTitle: "Prefere um magic link?",
      magicDescription:
        "Digite seu email e receba um link seguro de acesso. Isso ajuda quando o usuario foi criado por convite e ainda nao definiu senha.",
      emailLabel: "Email",
      emailPlaceholder: "voce@exemplo.com",
      passwordLabel: "Senha",
      passwordPlaceholder: "Sua senha",
      signupPasswordPlaceholder: "Crie uma senha",
      signInButton: "Entrar",
      signUpButton: "Criar minha conta",
      magicButton: "Enviar magic link",
      backHome: "Voltar para a visao geral do produto",
      productEyebrow: "Dentro do produto",
      productTitle: "O que um criador conectado vai sentir",
      bullets: [
        "Um dashboard privado ligado a uma conta real",
        "Um status claro de pagina publicada ou rascunho",
        "Uma nocao visivel de recursos liberados e proximos passos",
        "Uma rota publica ao vivo ligada ao perfil salvo",
      ],
      feedback: {
        missing_credentials: "Informe seu email e sua senha para continuar.",
        missing_signup_credentials: "Informe seu email e sua senha para criar sua conta.",
        missing_magic_email: "Informe seu email para receber um magic link.",
        could_not_sign_in: "Nao foi possivel entrar com essas credenciais.",
        could_not_sign_up: "Nao foi possivel criar sua conta agora.",
        could_not_send_magic_link: "Nao foi possivel enviar o magic link agora.",
        signup_confirmation_email_failed: "Nao foi possivel enviar o email de confirmacao. Se o SMTP customizado estiver desligado, o Supabase costuma limitar esse envio a emails do time do projeto e a uma cota bem baixa.",
        signup_email_registered: "Este email ja esta cadastrado. Tente entrar ou usar o magic link.",
        signup_invalid_email: "Esse email parece invalido. Revise o endereco digitado e tente de novo.",
        signup_weak_password: "Sua senha esta fraca. Use pelo menos 6 caracteres e tente novamente.",
        signup_disabled: "O cadastro por email esta desativado neste momento. Tente novamente mais tarde.",
        signup_rate_limited: "Voce tentou criar contas muitas vezes em pouco tempo. Aguarde um pouco e tente novamente.",
        login_invalid_credentials: "Email ou senha incorretos, ou sua conta ainda nao foi confirmada por email.",
        login_rate_limited: "Muitas tentativas de login em pouco tempo. Aguarde um pouco e tente novamente.",
        magic_confirmation_email_failed: "Nao foi possivel enviar o magic link. O provedor de email do projeto recusou o envio ou o servico padrao do Supabase atingiu o limite.",
        magic_invalid_email: "Esse email parece invalido. Revise o endereco digitado para receber o magic link.",
        magic_disabled: "O envio por email esta desativado neste momento. Tente novamente mais tarde.",
        magic_rate_limited: "Muitos emails enviados em pouco tempo. Aguarde um pouco antes de tentar de novo.",
        check_email: "Confira seu email para confirmar sua conta.",
        magic_link_sent: "Magic link enviado. Verifique sua caixa de entrada.",
        signed_out: "Voce saiu com sucesso.",
        verify_link_failed: "Nao foi possivel validar esse link de email.",
        sign_in_required: "Entre para acessar seu dashboard de criador.",
      },
    },
    dashboard: {
      eyebrow: "Dashboard MVP",
      title: "Bem-vindo de volta, {name}",
      description:
        "Sua conta agora esta conectada a camada de produto. Este dashboard ja reflete a sessao real e pode evoluir para edicao, analytics, planos e controles de publicacao.",
      editorDescription: "Atualize os dados centrais da sua pagina e salve direto no banco real.",
      sessionLabel: "Sessao",
      sessionAuthenticated: "Autenticado",
      sessionFallback: "Modo mock",
      sessionFallbackDescription: "Usando a conta local de fallback enquanto o Supabase nao estiver disponivel.",
      profileStatusLabel: "Status do perfil",
      profilePublished: "Publicado",
      profileDraft: "Rascunho",
      profilePublishedDescription: "Sua pagina publica ja pode ser acessada em /u/{username}.",
      profileDraftDescription: "Publique este perfil quando quiser colocar sua pagina no ar.",
      unlockedLabel: "Liberado",
      unlockedSuffix: "servicos ativos",
      unlockedDescription: "Perfil publico, pilha de links, tema visual e acesso protegido ao dashboard ja estao conectados.",
      publicCardLabel: "Link de apresentacao",
      publicCardTitle: "Sua arvore de links publica",
      publicCardPublished: "Pronto para divulgar",
      publicCardDraft: "Aguardando publicacao",
      publicCardDescriptionPublished: "Seu perfil ja pode ser compartilhado com qualquer pessoa como um link de apresentacao.",
      publicCardDescriptionDraft: "Ative a publicacao do perfil para transformar sua pagina em um link publico para divulgacao.",
      publicCardUrlLabel: "URL publica",
      publicCardOpen: "Abrir pagina publica",
      identityLabel: "Identidade do criador",
      identityTitle: "Informacoes do perfil vindas da sua conta",
      identityLive: "Ao vivo no Supabase",
      identityFallback: "Dados de fallback",
      fields: {
        displayName: "Nome de exibicao",
        username: "Username",
        bio: "Bio",
        avatarUrl: "Avatar (URL)",
        links: "Links",
        theme: "Tema visual",
        visibility: "Publicacao",
      },
      themeOptions: {
        "midnight-grid": "Midnight Grid",
        "sunset-signal": "Sunset Signal",
      },
      visibilityDraft: "Manter como rascunho",
      visibilityPublished: "Publicar pagina",
      saveButton: "Salvar perfil",
      avatarUpload: "Enviar nova foto",
      avatarUploadHint: "Formatos aceitos: JPG, PNG, WEBP, GIF ou AVIF com ate 5 MB.",
      avatarRemove: "Remover avatar atual",
      linksDescription: "Edite os links publicos, reorganize a ordem, desative o que nao quiser mostrar e adicione novos botoes.",
      linkTitle: "Titulo",
      linkUrl: "URL",
      linkPosition: "Ordem",
      linkStatus: "Status",
      linkRemove: "Remover",
      linkNew: "Novo link",
      linkInactiveHint: "Desative para esconder este botao da pagina publica.",
      addLinkHint: "Preencha titulo e URL para criar um novo link.",
      saveLinksButton: "Salvar links",
      mockReadonly: "O modo mock nao salva alteracoes. Conecte o Supabase para editar o perfil real.",
      linkActive: "Ativo",
      linkInactive: "Inativo",
      emptyLinks: "Ainda nao existem links. Use o bloco abaixo para criar seus primeiros botoes publicos.",
      nextStep:
        "Proximo passo de implementacao: adicionar onboarding guiado, analytics de cliques e mais blocos de conteudo para transformar a pagina em mini site.",
      pendingProfileName: "Novo criador",
      pendingProfileBio:
        "Sua conta esta autenticada, mas o registro do perfil ainda precisa ser criado ou vinculado corretamente no banco de dados.",
      feedback: {
        profile_saved: "Perfil salvo com sucesso.",
        links_saved: "Links salvos com sucesso.",
        profile_save_failed: "Nao foi possivel salvar o perfil agora.",
        links_save_failed: "Nao foi possivel salvar os links agora.",
        username_taken: "Esse username ja esta em uso. Tente outro.",
        invalid_username: "Use um username entre 3 e 32 caracteres com letras minusculas, numeros e hifens.",
        invalid_display_name: "Informe um nome de exibicao para salvar o perfil.",
        invalid_avatar_url: "Use uma URL valida para o avatar ou deixe o campo vazio.",
        invalid_avatar_file: "Envie uma imagem valida de ate 5 MB para o avatar.",
        avatar_upload_failed: "Nao foi possivel enviar a foto de perfil agora.",
        invalid_link_title: "Cada link precisa ter um titulo antes de salvar.",
        invalid_link_url: "Cada link precisa usar uma URL valida com http:// ou https://.",
        unauthorized: "Entre novamente para continuar editando seu perfil.",
        mock_mode_readonly: "O modo mock nao permite salvar alteracoes reais.",
      },
    },
    publicProfile: {
      backHome: "Voltar para o app",
    },
    notFound: {
      title: "Este perfil ainda nao existe",
      description:
        "Quando o SaaS estiver totalmente conectado a autenticacao e persistencia, esta rota vai resolver paginas publicas reais de criadores.",
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
        "This is the first real entry point of the SaaS. Sign in, create your account, or use a magic link to access your dashboard without friction.",
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
        unauthorized: "Sign in again to keep editing your profile.",
        mock_mode_readonly: "Mock mode does not allow saving real changes.",
      },
    },
    publicProfile: {
      backHome: "Back to app",
    },
    notFound: {
      title: "This profile does not exist yet",
      description:
        "Once the SaaS is fully connected to auth and persistence, this route will resolve real public creator pages.",
      cta: "Back to app home",
    },
  },
};
