%*******
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  conferencearticle.cls  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%===========================================================================
%%% 
%%%  LaTeX-style-file{
%%%    author          = "Fuji Technology Press Ltd.",
%%%    version         = "3.6",
%%%    date            = "April 2018",
%%%    filename        = "conferencearticle.cls"
%%%    email           = "jaciii@fujipress.jp
%%%    keywords        = "LaTeXqq, JACIII, publisher style",
%%%    mainserver      = "via E-mail from balemi@aut.ee.ethz.ch ",
%%%    docstring       = "This is a LaTeX class file for preparation
%%%                       of submission and final versions of articles
%%%                       to be published in Journal of Advanced Computational
%%%                       Intelligence and Intelligent Informatics.
%%%                       The default font size is 10.5 points ,
%%%                       .
%%%
%%%                        Usage:
%%%                         \documentclass{jaciiiarticle}
%%%                         \begin{document}
%%%                         \SetVolumeNumber{Vol.XX No.XX, 200X}
%%%                         \setcounter{page}{# of first page} 
%%%                         \title{..}
%%%                         \author{..}
%%%                         \address{address list}
%%%                         \dates{received date}{accepted date}
%%%                         \markboth{authors in header}{title in header}
%%%                         \pagestyle{jaciiistyle}
%%%                         \maketitle
%%%                         \begin{abstract}{}..\end{abstract}
%%%                         \begin{keywords}...\end{keywords}
%%%                         ...
%%%                         \begin{biography}{Author's name}...\end{biography}
%%%                         \end{document}
%%%
%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\typeout{Document Class `conferencearticle' v3.5.1 <August 4, 2008>}
\typeout{Read the source comments for docs.}
\NeedsTeXFormat{LaTeX2e}[1995/12/01]
\ProvidesClass{conferencearticle}[2008/08/04 revision v3.5.1 by K. Hayashi]


\usepackage{times,mathptmx,calc,type1cm,bm,citesort} 
\usepackage{amsmath} %2008/8/1 Uchino

\newcommand\jtoday{\the\year/\the\month/\the\day}%Japanese format date 2006/2/15
\newcommand\@ptsize{}
\newif\if@restonecol
\newif\if@titlepage      \@titlepagefalse
\newif\if@draftclsmode   \@draftclsmodefalse
\newif\if@technote       \@technotefalse
\newif\if@editorialtwocolumn \@editorialtwocolumnfalse %for Editorial twocolumn 2005/7/28

%%% Japanese Environment  Preliminar 2006/1/20 Uchino 
\newif\if@langJapanese \@langJapanesefalse %
\def\Japanese{Japanese}\gdef\@languageOut{English}%
\newcommand\articlelanguage[1]{\renewcommand{\@languageOut}{#1}\ifx\@languageOut\Japanese\@langJapanesetrue\fi}
%%%%%

\input{conferencearticlefont.clo}

% JACIII uses a4paper
\setlength\paperheight{297mm}%
\setlength\paperwidth {597.6pt}%{210mm}

% JACIII uses Times New Roman font, so we'll default to times new roman.


% These three commands are the entire times.sty package.
\renewcommand{\sfdefault}{phv}
\renewcommand{\rmdefault}{ptm}
\renewcommand{\ttdefault}{pcr}
\normalfont\selectfont

% set sizes and margins
% old values, metric is not popular in USA book printing.
% Heck, they don't even seem to use inches. It is a world
% where point and pica (12pt) reign supreme. JACIII textwidth 
% is 21 pica. They have a colsep of 1 pica.
\setlength\topmargin{-1.0in}  
\addtolength{\topmargin}{16.14pt}

\setlength\textheight{708.45pt}     
\setlength\textwidth{502pt}% 2 x 20pc + 20pt = 500pt

\setlength\columnsep{20pt}

\setlength\oddsidemargin{-23.5pt} 
\setlength\evensidemargin{-23.5pt}

\setlength\parindent{10.5pt}
\setlength\headsep{20.56pt}
\setlength\headheight{20pt}

%%%%% Adjusting the space around '=' in eqnarray environment [2006/11/13 Ohmori&Kimura] %%%%%
\newlength{\eqarcolsep}
\newdimen{\eqarcolsep}
\eqarcolsep=0.14em

% Controls the amount of EXTRA spacing
% above and below \trivlist 
% Both \list and IED lists override this.
% However, \trivlist will use this as will most
% things built from \trivlist like the \center
% environment.
\topsep           1.3ex

\partopsep          \z@

% Controls the spacing between paragraphs in lists. 
% JACIII does not increase spacing before or after paragraphs
% so this is also zero. 
% With jaciiiarticle.cls, global changes to
% this value DO affect lists (but not IED lists).
\parsep             \z@

% Controls the extra spacing between list items. 
% JACIII does not put extra spacing between items.
% With jaciiiarticle.cls, global changes to this value DO affect
% lists (but not IED lists).
\itemsep            \z@

\itemindent         -1em


\DeclareOption{twoside}{\@twosidetrue  \@mparswitchtrue}
% If the user selects draft, then this class AND any packages
% will go into draft mode.

\DeclareOption{draft}{\setlength\overfullrule{5pt}}

\if@compatibility\else
  \DeclareOption{final}{\setlength\overfullrule{0pt}}
\fi

% draftcls is for a draft mode which will not affect any packages
% used by the document.
\DeclareOption{draftclsmode}{\@draftclsmodetrue}

\DeclareOption{titlepage}{\@titlepagetrue}
\if@compatibility\else
  \DeclareOption{notitlepage}{\@titlepagefalse}
\fi

\DeclareOption{twocolumn}{\@twocolumntrue}
\DeclareOption{editorialtwocolumn}{\@editorialtwocolumntrue}%for Editorial twocolumn 2005/7/28

\DeclareOption{technote}{\@technotetrue}  % sets variable for techn. note

%%%% Tombo Option (2004/11/2 by K.O.)

\DeclareOption{tombo}{%
  \tombowtrue \tombowdatefalse
  \setlength{\@tombowwidth}{.1\p@}%
  \hoffset=-.6in\voffset=-.6in
  %\hoffset=-.2in\voffset=-1.6in
\AtBeginDvi{\special{papersize=230mm,317mm}}
  \maketombowbox}

%%%% Declare option for various case
\newif\if@paper \@paperfalse
\newif\if@review \@reviewfalse
\newif\if@development \@developmentfalse
\newif\if@survey \@surveyfalse%%% added by K.O. on 2006/5/31
\newif\if@letter \@letterfalse
\newif\if@note \@notefalse
\newif\if@news \@newsfalse%%% added by K.O. on 2006/5/31
\newif\if@discussion \@discussionfalse%%% added by K.O. on 2006/5/31
\newif\if@tutorial \@tutorialfalse%%% added by K.O. on 2006/5/31
\newif\if@material \@materialfalse%%% added by K.O. on 2006/5/31
\newif\if@editorial \@editorialfalse%%% add 2005/7/25 Uchino


\def\form{Paper:}%% default value of \form is Paper:, this is refered in \@maketitle
\DeclareOption{paper}{\@papertrue \def\form{Paper:}\gdef\@articlekindOut{Paper}}
\DeclareOption{review}{\@reviewtrue \def\form{Review:}\gdef\@articlekindOut{Review}}
\DeclareOption{development}{\@developmenttrue \def\form{Development Report:}\gdef\@articlekindOut{Development Report}} %%%%modified by K.O. (2005/1/14)
\DeclareOption{survey}{\@surveytrue \def\form{Survey Report:}\gdef\@articlekindOut{Survey Report}}%%% added by K.O. on 2006/5/31
\DeclareOption{letter}{\@lettertrue \def\form{Letter:}\gdef\@articlekindOut{Letter}}
\DeclareOption{note}{\@notetrue \def\form{Note:}\gdef\@articlekindOut{Note}}
\DeclareOption{news}{\@newstrue \def\form{News:}\gdef\@articlekindOut{News}}%%% added by K.O. on 2006/5/31
\DeclareOption{discussion}{\@discussiontrue \def\form{Discussion:}\gdef\@articlekindOut{Discussion}}%%% added by K.O. on 2006/5/31
\DeclareOption{tutorial}{\@tutorialtrue \def\form{Tutorial:}\gdef\@articlekindOut{Tutorial}}%%% added by K.O. on 2006/5/31
\DeclareOption{material}{\@materialtrue \def\form{Material:}\gdef\@articlekindOut{Material}}%%% added by K.O. on 2006/5/31
\DeclareOption{editorial}{\@editorialtrue \def\form{Editorial for Special Issue}\gdef\@articlekindOut{Editorial}}%%% add 2005/7/25 Uchino
%%Added to Define \@articlekindOut for FINDER data (OFIND) 2006/1/6 by uchino


%%%% branching variable to different journals
%%%% define journal identifer valid throughout this class file
\def\@journal{0}%%default(0:jaciii, 1:jrm, 2:add new journal here,...)
\DeclareOption{conference}{\def\@journal{0}}%conference
\DeclareOption{JRM}{\def\@journal{1}}%JRM
\DeclareOption{JDR}{\def\@journal{2}}%JDR%%% added by K.O. on 2006/5/31
%DeclareOption{NewJournal}{\def\@journal{journal identifer number}}

%%%% output configuration for respective style 
\newif\if@referee \@refereefalse %% referee style(neither author name nor profile)
\newif\if@publish \@publishfalse %% publishing style(Publish style, everything included)

\newif\if@author \@authortrue %%author output
\newif\if@address \@addressfalse %%address output
\newif\if@dates  \@datesfalse %%dates output
\newif\if@volumeNumber \@volumeNumberfalse %%volumeNumber output

\newif\if@editors \@editorsfalse %%editors output for editorial 2005/7/22 Uchino

\newif\if@doubleskip \@doubleskipfalse %%double baselineskip for proof readers  
\newif\if@header \@headertrue %%header output
\newif\if@footer \@footertrue %%footer output
\newif\if@reference \@referencetrue %%reference output
\newif\if@profile \@profilefalse %%profile output


\DeclareOption{referee}{\@authorfalse \@headerfalse \@footerfalse \@profilefalse}
\DeclareOption{proof}{\@doubleskiptrue \@profiletrue \@referencefalse}
\DeclareOption{publish}{\@profiletrue}

%%&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

\DeclareOption{openbib}{%
  \AtEndOfPackage{%
    \renewcommand\@openbib@code{
      \advance\leftmargin\bibindent
      \itemindent -\bibindent
      \listparindent \itemindent
      \parsep \z@}
    \renewcommand\newblock{\par}}}%


\ExecuteOptions{a4paper,twocolumn,twoside,final,openright}

\ProcessOptions\relax

% \@options
%%%% For editorial mode  2005/7/25 Uchino
\if@editorial
 \if@editorialtwocolumn\else\@twocolumnfalse\fi
\else\fi


\setlength\lineskip{1\p@}
\setlength\normallineskip{1\p@}
\renewcommand\baselinestretch{}

%%%% definition of baselineskip(Added by Y.K 2004/05/13
\if@doubleskip 
%\setlength\baselineskip{24pt}
\renewcommand\baselinestretch{2.5}
%\setlength{\lineskip{2\p@}}
\fi

% normally zero, should be relative to font height.
% put in a little rubber to help stop bad breaks
%\setlength\parskip{0ex \@plus 0.2ex \@minus 0.2ex}
\parskip 0pt 

\@lowpenalty   51
\@medpenalty  151
\@highpenalty 301
\setcounter{topnumber}{2}
\renewcommand\topfraction{1.0}
\setcounter{bottomnumber}{2}
\renewcommand\bottomfraction{.4}
\setcounter{totalnumber}{4}
\renewcommand\textfraction{.2}
\renewcommand\floatpagefraction{.8}
\setcounter{dbltopnumber}{4}
\renewcommand\dbltopfraction{1.0}
\renewcommand\dblfloatpagefraction{.8}
%%% Adjusted the float parameter for big float [2008/8/4 Uchino] %%%%%
\def\bigfloat{
\renewcommand{\topfraction}{1.0}
\renewcommand{\bottomfraction}{1.0}
\renewcommand{\textfraction}{0.0}
\setlength{\dbltextfloatsep}{0pt}
\setlength{\dblfloatsep}{0pt}
}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%% Add Index Tab for Special Issue,General Papeper, etc. 
%%% (Added by Uchino 2008/1/30)
\newif\if@IndexTab\@IndexTabfalse%
\newcommand{\SetIndexTab}[1]{\@IndexTabtrue\SetTabvoffset{#1}}%
\newcommand{\setnewlength}[2]{\newlength{#1}\setlength{#1}{#2}}%
%% define tab rule
\setnewlength{\tabwidth}{1cm}% Tab width in paper
\setnewlength{\tabheight}{1.5cm}% Tab height
\setnewlength{\tabpaperout}{0.5cm}% Tab lenght out of paper width
\setnewlength{\tabboxwidth}{\tabwidth}%
\advance\tabboxwidth by \tabpaperout% Printed tab box width
\def\indextabrule{\vbox{\hrule width\tabboxwidth height\tabheight}}
%% culculate horizontal distance from textarea start point 
%% to tab start point for even page and odd page
\setnewlength{\defaultmargin}{1in}%
%\evenpagetabhoffset =-(\defaultmargin+\evensidemargin)-\tabpaperout
\setnewlength{\@@epto}{0pt}% temp register
\advance\@@epto by \defaultmargin%
\advance\@@epto by \evensidemargin%
\setnewlength{\@epto}{-\@@epto}%
\advance\@epto by -\tabpaperout%
\setnewlength{\evenpagetabhoffset}{\@epto}%
%\oddpagetabhoffset = \paperwidth-(\defaultmargin+\oddsidemargin)-\tabwidth
\setnewlength{\@@opto}{\paperwidth}%
\advance\@@opto by -\defaultmargin%
\advance\@@opto by -\oddsidemargin%
\advance\@@opto by -\tabwidth%
\setnewlength{\@opto}{\@@opto}%
\setnewlength{\oddpagetabhoffset}{\@opto}%
%
%% defined vertical distance from header top point to tab start point 
%% for each term
%\setnewlength{\defaultvoffset}{-\headheight}%
%\advance\defaultvoffset by \tabheight%
\setnewlength{\@tmplength}{\tabheight}\advance\@tmplength by \headsep%
%
\def\@specialissue{specialissue}% for Special Issue page
\setnewlength{\tabvoffset@specialissue}{\@tmplength}% 
\def\@generalarticle{generalarticle}% for General Article page
\advance\@tmplength by \tabheight%
\setnewlength{\tabvoffset@generalarticle}{\@tmplength}%
\def\@review{review}% for Review Page
\advance\@tmplength by \tabheight%
\setnewlength{\tabvoffset@review}{\@tmplength}%
%
%% setting vertical tab offset
\def\SetTabvoffset#1{%
  \def\@issuekind{#1}%
  % setting vertical tab offset
  \ifx\@issuekind\@specialissue\def\tabvoffset{\tabvoffset@specialissue}
  \else%
    \ifx\@issuekind\@generalarticle\def\tabvoffset{\tabvoffset@generalarticle}% 
    \else%
      \ifx\@issuekind\@review\def\tabvoffset{\tabvoffset@review}% 
      \else%
      \@IndexTabfalse
      \fi%
    \fi%
  \fi%
}%
%
%Tab Output
\def\drawIndexTab{%
  % setting horizontal tab offset
  \ifodd\c@page\def\tabhoffset{\oddpagetabhoffset}%
  \else%
   \def\tabhoffset{\evenpagetabhoffset}%
  \fi%
%
  \moveto{\tabhoffset}{\tabvoffset}{\indextabrule}   
}%

%%% BEGIN define \movoto command %%%%%%%
%% Reference:
%% Y. Otobe and S. Eguch,''pLaTex2e for Windows Another Manual Vol.2'',
%% Softbank Publishing,  p.392, 1997.
\newbox\@pagerule
\def\hmoveto#1#2{% define horizontal move for box
  \setbox\@pagerule=\hbox{#2}\wd\@pagerule=\z@
  \hbox to \z@{\hskip#1\box\@pagerule\hss}
}
\def\vmoveto#1#2{% define vartical move for box
  \ifvmode\leavemode\fi%
  \setbox\@pagerule=\hbox{#2}\ht\@pagerule=\z@\dp\@pagerule=\z@
  \vbox to \z@{\vskip#1\box\@pagerule\vss}
}
\def\moveto#1#2#3{\hmoveto{#1}{\vmoveto{#2}{#3}}}
%%%%% END define \movoto command %%%%%%%
%
%%%%%%%%%%%%%%%%  END of Index Tab out Define %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\newcommand{\SetVolumeNumber}[1]{\def\VolumeNumber{#1}\@volumeNumbertrue}

\newif\if@articleID\@articleIDfalse
\newcommand{\SetArticleID}[1]{\def\ArticleID{#1}\@articleIDtrue}

%%JACIII
\def\@oddfoottmp{%
  \renewcommand\baselinestretch{1}%resets baselinestretch for normali case
  \ifcase \@journal
  %
  %%%%______ default (JACIII) _________________________
  \fontsize{10pt}{12pt}\selectfont%
  \begin{minipage}{500pt}
    \begin{tabular}{lcr}
 
 &  The 8$^{\rm th}$ International Symposium on Computational Intelligence and Industrial Applications (ISCIIA2018)   & \\%[1mm]
 &  The 12$^{\rm th}$ China-Japan International Workshop on Information Technology and Control Applications (ITCA2018)   & \hspace{15pt} \thepage \\%[1mm]
 & Binjiang International Hotel, Tengzhou, Shandong, China, Nov. 2-6, 2018 & 
            
    \end{tabular}
  \end{minipage}
  \or %%JRM(identifer 1)
  \fontsize{10.5pt}{12pt}\selectfont%
  \begin{minipage}{500pt}
    \begin{tabular}{lcr}
      \hspace*{-.6em}\hbox to 125pt{Journal of Robotics and Mechatronics \if@volumeNumber\VolumeNumber\fi\hfil} & \hspace{22.8em} & \hbox to 115pt{\hfil\thepage}
    \end{tabular}
  \end{minipage}
  \or %%JDR
  \fontsize{10.5pt}{12pt}\selectfont%
  \begin{minipage}{500pt}
    \begin{tabular}{lcr}
      \hspace*{-.6em}\hbox to 125pt{Journal of Disaster Research \if@volumeNumber\VolumeNumber\fi\hfil} & \hspace{22.8em} & \hbox to 115pt{\hfil\thepage}
    \end{tabular}
  \end{minipage}
  %% if you want to add new journal information, write here new style as following
  %%\or %%new journal
  %%\def\fontsize{.....}\selectfont
  %%\begin{minipage}{width of header}
  %% define desired output here
  %%\end{minipage}
  \else %%exception -> JACIII(default)
  \fontsize{10.5pt}{12pt}\selectfont%
  \begin{minipage}{500pt}
    \begin{tabular}{lcr}
      \hspace*{-.6em}\hbox to 125pt{\if@volumeNumber\VolumeNumber\fi\hfil} & \hbox to 240pt{\hfil Journal of Advanced Computational Intelligence\hfil}  & \hbox to 115pt{\hfil\thepage}\\
      & and Intelligent Informatics & 
    \end{tabular}
  \end{minipage}
  \fi%%end of \ifcase \@journal
} %end of oddfoottmp



\def\@evenfoottmp{%JACIII case
  \renewcommand\baselinestretch{1}%resets baselinestretch for normali case
  \ifcase \@journal
  %%______ JACIII case(identifer 0) ________________
  \fontsize{10.5pt}{12pt}\selectfont%
  \begin{minipage}{500pt}
    \begin{tabular}{lcr}
    
   %   \hspace*{-.6em}\hbox to 35pt{\hfil} & \hbox to 200pt{\hfil The 5th International Workshop on Advanced Computational Intelligence and Intelligent Informatics   \hfil}  & \hbox to 240pt{\hfil\thepage}\\[1mm]
   %   &\hspace*{2em}  (IWACIII2017), Nov.2-5 2017, Beijing, P.R. China \hspace*{-13em}& 
    
      \hspace*{-.6em}\hbox to 35pt{\thepage \hfil} & \hbox to 200pt{\hfil The 5th International Workshop on Advanced Computational Intelligence and Intelligent Informatics  \hfil} & \hbox to 220pt{\hfil\if@volumeNumber\VolumeNumber\fi}\\[1mm]
      &\hspace*{5em}  (IWACIII2017), Nov.2-5 2017, Beijing, P.R. China \hspace*{-13em}& 
    \end{tabular}
  \end{minipage}
  \or%%JRM(identifer 1)
  \fontsize{10.5pt}{10pt}\selectfont%
  \begin{minipage}{500pt}
    \begin{tabular}{lcr}
      \hspace*{-.6em}\hbox to 125pt{\thepage \hfil} & \hspace{11.2em} & \hbox to 115pt{Journal of Robotics and Mechatronics \if@volumeNumber\VolumeNumber\fi}\\
    \end{tabular}
  \end{minipage}
  \or%%JDR(identifer 2)
  \fontsize{10.5pt}{10pt}\selectfont%
  \begin{minipage}{500pt}
    \begin{tabular}{lcr}
      \hspace*{-.6em}\hbox to 125pt{\thepage \hfil} & \hspace{15.5em} & \hbox to 115pt{Journal of Disaster Research \if@volumeNumber\VolumeNumber\fi}\\
    \end{tabular}
  \end{minipage}
  %%
  %% if you want to add new journal information, write here new style as following
  %%\or %%new journal
  %%\def\fontsize{.....}\selectfont
  %%\begin{minipage}{width of header}
  %% define desired output here
  %%\end{minipage}
  \else%%Exception -> Default(JACIII)
  \fontsize{10.5pt}{12pt}\selectfont%
  \begin{minipage}{500pt}
    \begin{tabular}{lcr}
      \hspace*{-.6em}\hbox to 125pt{\thepage \hfil} & \hbox to 240pt{\hfil Journal of Advanced Computational Intelligence \hfil} & \hbox to 115pt{\hfil\if@volumeNumber\VolumeNumber\fi}\\
      & and Intelligent Informatics & 
    \end{tabular}
  \end{minipage}
  \fi%end of \ifcase \@journal
  
} %end of evenfoottmp


\def\ps@titlepagestyle{
  \if@draftclsmode 
  \def\@oddfoot{\scriptsize \@date\hfil DRAFT}
  \def\@evenfoot{\scriptsize DRAFT\hfil \@date}
  \else % not draft class mode  
  \fi
} %% end of ps@titlepage

\def\ps@conferencestyle{
  \if@header%% added by Y.K(2003/11/11)
  \def\@oddhead{ 
   \if@IndexTab{\hbox to \z@{\drawIndexTab}}\else\fi% add index tab by Uchino (2008/1/30)
    \begin{minipage}{498pt}%500pt will be error
      \renewcommand\baselinestretch{1}
      \fontsize{9pt}{10pt}\selectfont  
      \begin{flushright}\hfill \vtop{\hsize=300pt \rightmark} \end{flushright}
      \normalfont
    \end{minipage}
  }
  
  \def\@evenhead{%
    \if@IndexTab{\hbox to \z@{\drawIndexTab}}\else\fi% add index tab by Uchino (2008/1/30)
    \begin{minipage}{498pt}
      \renewcommand\baselinestretch{1}
      \fontsize{9pt}{10pt}\selectfont  
      \begin{flushleft} \vtop{\hsize=300pt \leftmark}\hfill \end{flushleft}
      \normalfont
    \end{minipage}
  }
  \fi%%end of if@header
  
  \if@footer%% added by Y.K(2003/11/11)
  \def\@oddfoot{\@oddfoottmp}
  \def\@evenfoot{\@evenfoottmp}
  \else
  \def\@oddfoot{DRAFT \hfil \thepage}
  \def\@evenfoot{DRAFT \hfil \thepage}
  \fi%% added by Y.K(2003/11/11)
} % end of jaciiipagestyle

\newcommand\maketitle{\par%
  \begingroup
    \renewcommand\thefootnote{} % the \thanks{} mark type is empty
%    \gdef\@startpageOut{\the\c@page}%for (OFIND) 2006/1/6 by uchino%
\if@editorial%%for editorial  2005/7/25 Uchino
          \if@editorialtwocolumn\twocolumn[\@maketitle]%
%            \else\newpage\global\@topnum\z@ \@maketitle% 
% if exits \newpage, in case of single column is selected, 
% ``Editorial for Special issue'' is presented on below line less than 
% normal position( same position ``Paper'',``Review'' etc.)
            \else\global\@topnum\z@ \@maketitle% 2005/7/28
          \fi%
\else% 2005/7/25
    \if@twocolumn
      \if@technote   
        \newpage\global\@topnum\z@ \@maketitle
      \else\twocolumn[\@maketitle]              
      \fi
    \else\newpage\global\@topnum\z@ \@maketitle 
    \fi
\fi% 2005/7/25
  \thispagestyle{titlepagestyle}\@thanks
  \endgroup
  \setcounter{footnote}{0}\let\maketitle\relax\let\@maketitle\relax
%  \gdef\@thanks{}\gdef\@author{}\gdef\@title{}
%%%%Modefied for Editorial start 2005/7/25
    \if@editorial
     \gdef\@thanks{}\gdef\@title{}
    \else\gdef\@thanks{}\gdef\@author{}\gdef\@title{}
    \fi
%%%%Modefied for Editorial end
  \let\thanks\relax
  \if@draftclsmode \vfil\mbox{}\newpage\fi
}

\newcommand{\address}[1]{\newcommand{\@address}[1]{#1}\@addresstrue}
\newcommand{%
 \dates}[2]{\newcommand{\d@received}[1]{#1}\newcommand{\d@accepted}[1]{#2}\@datestrue%
 \gdef\@receiveOut{#1}\gdef\@acceptOut{#2}%for OFIND 2006/1/6 by uchino
 }
%% Define @maketitle
%%%% Modefied 2005/7/25 Uchino
%%title of editorial  2005/7/25 Uchino
\if@editorial
\newcommand\editors[1]{\newcommand{\@@editors}{\expandafter#1}\@editorstrue}
%\newcommand\@editors[1]{\newcommand{\@@editors}{\expandafter#1}\@editorstrue}
%\newenvironment{editors}{\@editors\bgroup}{}
\def\editor#1#2{%
     \renewcommand{\author}[1]{\fontsize{12pt}{14pt}\bfseries{##1}\normalfont}%
     \renewcommand{\address}[1]{\parbox[t]{#1}{\fontsize{8pt}{11.5pt}\selectfont{##1}\normalfont}}%
  \parbox[t]{#1}{\centering\expandafter#2}%
}%
\def\@maketitle{\newpage%
  \if@doubleskip\renewcommand\baselinestretch{1}\fi%reset baseline skip
  \if@draftclsmode\mbox{}\vfil\fi%
  \begin{center}
	\vspace*{-1pt}%%16.14pt(topmargin)+19pt(headheight)+20.56pt(headsep)-56.7(``Paper:'' from the paper top edge)
	\begin{flushleft}
	  {\fontsize{10pt}{11.12pt}\selectfont \textbf{%
	      \form \if@articleID\hspace*{.5em}\ArticleID\fi}\normalfont}
	\end{flushleft}
        \vspace*{10mm}%
	\vskip0.2em{\fontsize{18pt}{20pt}\bfseries\@title\par\normalfont}\vskip1.0em%Draw title
	\if@editors\@@editors\else\fi
  \end{center}
%  \if@technote
%  \else
  \vspace*{22.98pt} %% from [Received:....] to the main text field 
%  \fi
} %% end of maketitle for editorial
\else
%% title of normal article
\def\@maketitle{\newpage%
  \if@doubleskip\renewcommand\baselinestretch{1}\fi%reset baseline skip
  \if@draftclsmode\mbox{}\vfil\fi%
  \begin{center}
    \if@technote
	{\textbf{\Large\@title}\par}\vskip 1.3em {\lineskip .5em\begin{tabular}[t]{c}\@author\end{tabular}\@specialpapernotice\par}
	\else
	\vspace*{-1pt}%%16.14pt(topmargin)+19pt(headheight)+20.56pt(headsep)-56.7(``Paper:'' from the paper top edge)
	\begin{flushleft}
	  {\fontsize{10pt}{11.12pt}\selectfont \textbf{%
	      \form \if@articleID\hspace*{.5em}\ArticleID\fi}\normalfont}
	\end{flushleft}
	\vskip0.2em{\fontsize{18pt}{20pt}\bfseries\@title\par\normalfont}\vskip1.0em%Draw title
	
	\if@author%% added by Y.K (2003/11/11)
	    {\lineskip0.5em\fontsize{12pt}{14pt}{\bfseries
	      \begin{tabular}[t]{c}
		\@author
	      \normalfont\end{tabular}}\\
	      \vspace*{8pt}
		      {\if@address%
			\fontsize{8pt}{11.5pt}\selectfont\@address{} \par%
			\fi%end of if@address
			\if@dates%
			    [Received \d@received{}; accepted \d@accepted{}]%
			    \fi%end of \if@dates
			    \normalfont}
		      \@specialpapernotice\par}
	    \fi%End of if@author
	    \fi
  \end{center}
  \if@technote
  \else
  \vspace*{22.98pt} %% from [Received:....] to the main text field 
  \fi
} %% end of maketitle for normal article
\fi

\if@technote
  \setcounter{secnumdepth}{3}
\else
  \setcounter{secnumdepth}{4}
\fi

\newcounter {section}
\newcounter {subsection}[section]
\newcounter {subsubsection}[subsection]
\newcounter {paragraph}[subsubsection]
\newcounter {subparagraph}[paragraph]

% @@@@@@@@@@@@@@@@@@@ Modified by T.O. 12/09/2003 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 

\renewcommand\thesection      {\@arabic\c@section}
\renewcommand\thesubsection   {\thesection.\@arabic\c@subsection}

\ifcase \@journal
\renewcommand\thesubsubsection{\thesubsection.\@arabic\c@subsubsection}%JACIII
\or
\renewcommand\thesubsubsection{\bf{\thesubsection.\@arabic\c@subsubsection}}%JRM
\or
\renewcommand\thesubsubsection{\bf{\thesubsection.\@arabic\c@subsubsection}}%JDR
\else
\renewcommand\thesubsubsection{\thesubsection.\@arabic\c@subsubsection}%Default JACIII
\fi

\renewcommand\theparagraph    {\@alph\c@paragraph}
\renewcommand\thesubparagraph {\@alpha\c@subparagraph}

\newcommand\ssection{\@startsection {section}{1}{\z@}
                                    {23pt} % \@plus 1.5ex \@minus 1.5ex}%
                                    {11pt} % \@plus 1ex   \@minus 0ex}%
                                    {\normalfont\fontsize{12pt}{14pt}\bfseries}}

\newcommand\ssubsection{\@startsection{subsection}{2}{\z@}%
                                     {3.5ex \@plus 1.5ex \@minus 1.5ex}%
                                     {0.7ex \@plus 0.5ex \@minus 0ex}%
                                     {\normalfont\fontsize{11pt}{13pt}\bfseries}}

\newcommand\ssubsubsection{\@startsection{subsubsection}{3}{\z@}% 
  {3.5ex \@plus 1.5ex \@minus 1.5ex}%
  {0.7ex \@plus 0.5ex \@minus 0ex}%
  {\normalfont\normalsize\ifcase\@journal%JACIII no bold face
    \or\bfseries\else\fi}}
				     

\newcommand\sparagraph{\@startsection{paragraph}{4}{\parindent}%
                                     {0ex \@plus 0.1ex \@minus 0.1ex}%
                                     {0ex}%
                                     {\normalfont\normalsize\itshape}}

\newcommand\section[1]{\ssection{\hspace{-11pt}.\hspace{5pt}#1}}
\newcommand\subsection[1]{\ssubsection{\hspace{-11pt}.\hspace{5pt}#1}}
\newcommand\subsubsection[1]{\ssubsubsection{\hspace{-11pt}.\hspace{5pt}#1}}
\newcommand\paragraph[1]{\sparagraph{\hspace{-11pt}.\hspace{5pt}#1}}



\newcommand\sacknowledgements{\@startsection {0}{1}{\z@}
                                    {23pt} % \@plus 1.5ex \@minus 1.5ex}%
                                    {2pt} % \@plus 1ex   \@minus 0ex}%
                                    {\normalfont\small\bfseries}}
\newcommand\acknowledgements[1][Acknowledgements]{\sacknowledgements*{#1}\small\noindent}

% &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

% we retain this stuff from the older jaciiiarticle.cls so that \list
% will work the same way as before. However, itemize, enumerate and
% description (IED) could care less about what these are as they
% all are overridden.
\setlength\leftmargin    {2.0em}
\setlength\leftmargini   {2.0em}
\setlength\leftmarginii  {1.0em}
\setlength\leftmarginiii {1.5em}
\setlength\leftmarginiv  {1.5em}
\setlength\leftmarginv   {1.0em}
\setlength\leftmarginvi  {1.0em}

\setlength\labelsep  {5pt}
\setlength\labelwidth{\z@}

\@beginparpenalty -\@lowpenalty
\@endparpenalty   -\@lowpenalty
\@itempenalty     -\@lowpenalty

\renewcommand\theenumi   {\@arabic\c@enumi}
\renewcommand\theenumii  {\@alph\c@enumii}
\renewcommand\theenumiii {\@roman\c@enumiii}
\renewcommand\theenumiv  {\@Alph\c@enumiv}

\newcommand\labelenumi   {\theenumi.}
\newcommand\labelenumii  {\theenumii.}
\newcommand\labelenumiii {\theenumiii.}
\newcommand\labelenumiv  {\theenumiv.}

\renewcommand\p@enumii{\theenumi}
\renewcommand\p@enumiii{\theenumi(\theenumii)}
\renewcommand\p@enumiv{\p@enumiii\theenumiii}

\newcommand\labelitemi{$\scriptstyle\bullet$}
\newcommand\labelitemii{\textbfseries{--}}
\newcommand\labelitemiii{$\ast$}
\newcommand\labelitemiv{$\cdot$}

\newcommand\jaciiitransversionmajor{1}
\newcommand\jaciiitransversionminor{5}

\newdimen\jaciiiilabelindentA
\newdimen\jaciiiilabelindentB
\newdimen\jaciiiilabelindent
\newdimen\jaciiielabelindent
\newdimen\jaciiidlabelindent
\newdimen\labelindent

\jaciiiilabelindentA \parindent
\jaciiiilabelindentB 1.3\parindent
\jaciiiilabelindent  \jaciiiilabelindentA
\jaciiielabelindent  \parindent
\jaciiidlabelindent  \parindent
\labelindent         \parindent

\newdimen\jaciiiiednormlabelsep
\newdimen\jaciiiiedmathlabelsep
\newdimen\jaciiiiedtopsep

\jaciiiiednormlabelsep 0.6em
\jaciiiiedmathlabelsep 1.2em
\jaciiiiedtopsep       0.3ex

\newcommand\jaciiilabelindentfactori{1.0}   % almost always one
\newcommand\jaciiilabelindentfactorii{0.75} % 0.0 or 1.0 may be used in some cases
\newcommand\jaciiilabelindentfactoriii{0.0} % 0.75? 0.5? 0.0?
\newcommand\jaciiilabelindentfactoriv{0.0}
\newcommand\jaciiilabelindentfactorv{0.0}
\newcommand\jaciiilabelindentfactorvi{0.0}
\newcommand\labelindentfactor{1.0}

%\renewenvironment{itemize}[1][\relax]{
%  \ifnum \@itemdepth >3 \@toodeep\else
%  \ifnum \@listdepth >5 \@toodeep\else
%      \advance\@itemdepth\@ne 
%      \edef\@itemitem{labelitem\romannumeral\the\@itemdepth}%
%      % get the labelindentfactor for this level
%      \advance\@listdepth\@ne % we need to know what the level WILL be
%      \edef\labelindentfactor{\csname jaciiilabelindentfactor\romannumeral\the\@listdepth\endcsname}
%      \advance\@listdepth-\@ne % undo our increment
%      \def\@iedjustify{2} % right justified labels are default
%      \nocalcleftmarginfalse
%      \nolabelindentfactorfalse
%      \topsep \jaciiiiedtopsep
%      \labelindent\jaciiiilabelindent
%      \labelsep\jaciiiiednormlabelsep
%      \partopsep 0ex
%      \parsep 0ex
%      \itemsep 0ex
%      \rightmargin 0em
%      \listparindent 0em
%      \itemindent 0em
%      \settowidth{\labelwidth}{\csname labelitem\romannumeral\the\@itemdepth\endcsname}
%      \@savelistparams% save our list parameters
%      \list{\csname\@itemitem\endcsname}{%
%        \@restorelistparams % override any list{} changes
%                            % to our globals
%       \iedlistdecl % let user alter parameters
%        #1\relax
%       \ifnolabelindentfactor \relax
%        \else \labelindent =\labelindentfactor\labelindent
%        \fi
%        \ifnocalcleftmargin \relax
%        \else \calcleftmargin{\labelindent} 
%        \fi
%        % justify the label appropriately
%        \let\makelabel\@iedmakelabelright % right if don't know
%                                          % what else to do 
%        \ifnum \@iedjustify =0 \let\makelabel\@iedmakelabelleft \fi
%        \ifnum \@iedjustify =1 \let\makelabel\@iedmakelabelcenter \fi
%      }  
%  \fi\fi
%}{\endlist}

%\renewenvironment{enumerate}[1][\relax]
%  {\ifnum \@enumdepth >3 \@toodeep\else
%   \ifnum \@listdepth >5 \@toodeep\else
%   \advance\@enumdepth\@ne
%   \edef\@enumctr{enum\romannumeral\the\@enumdepth}%
%   \advance\@listdepth\@ne % we need to know what the level WILL be
%   \edef\labelindentfactor{\csname jaciiilabelindentfactor\romannumeral\the\@listdepth\endcsname}
%   \advance\@listdepth-\@ne % undo our increment
%   \nocalcleftmarginfalse
%   \nolabelindentfactorfalse
%   \topsep \jaciiiiedtopsep
%   \labelindent\jaciiielabelindent
%   \labelsep\jaciiiiednormlabelsep
%   \partopsep 0ex
%   \parsep 0ex
%   \itemsep 0ex
%   \rightmargin 0em
%   \listparindent 0em
%   \itemindent 0em
%   \settowidth{\labelwidth}{9)}
%   \@savelistparams % save our list parameters
%   \list{\csname label\@enumctr\endcsname}{%
%     \usecounter{\@enumctr}
%     \@restorelistparams % override any list{} changes
%                         % to our globals
%     \iedlistdecl % let user alter parameters 
%     #1\relax
%     % If the user has requested not to use the
%     % labelindent factor, don't revise \labelindent
%     \ifnolabelindentfactor \relax
%     \else \labelindent=\labelindentfactor\labelindent
%     \fi
%     \ifnocalcleftmargin \relax
%     \else \calcleftmargin{\labelindent} 
%     \fi          
%     % justify the label appropriately
%     \let\makelabel\@iedmakelabelright % right if don't know
%                                       % what else to do 
%     \ifnum \@iedjustify =0 \let\makelabel\@iedmakelabelleft \fi
%     \ifnum \@iedjustify =1 \let\makelabel\@iedmakelabelcenter \fi
%     }
%     \fi
%   \fi}%
%{\endlist}


%%%%________ new enumerate/itemize environment ______________________________

\def\enumerate{%
  \ifnum \@enumdepth >\thr@@\@toodeep\else
    \advance\@enumdepth\@ne
    \edef\@enumctr{enum\romannumeral\the\@enumdepth}%
      \expandafter
      \list
        \csname label\@enumctr\endcsname
        {\usecounter\@enumctr\def\makelabel##1{\hss\llap{##1}}}%
  \fi}
\let\endenumerate =\endlist
\newcount\@itemdepth \@itemdepth = 0
\def\itemize{%
  \ifnum \@itemdepth >\thr@@\@toodeep\else
    \advance\@itemdepth\@ne
    \edef\@itemitem{labelitem\romannumeral\the\@itemdepth}%
    \expandafter
    \list
      \csname\@itemitem\endcsname
      {\def\makelabel##1{\hss\llap{##1}}}%
  \fi}
\let\enditemize =\endlist


%%_________________________________________________________________

\newenvironment{description}[1][\relax]{
  \ifnum \@listdepth >5 \@toodeep\else
    % get the labelindentfactor for this level
    \advance\@listdepth\@ne % we need to know what the level WILL be
    \edef\labelindentfactor{\csname jaciiilabelindentfactor\romannumeral\the\@listdepth\endcsname}
    \advance\@listdepth-\@ne % undo our increment
    \def\@iedjustify{2} % left justified labels are default
    \nocalcleftmarginfalse
    \nolabelindentfactorfalse
    \topsep\jaciiiiedtopsep 
    \labelindent\jaciiidlabelindent
    \labelsep\jaciiiiednormlabelsep
    \partopsep 0ex
    \parsep 0ex
    \itemsep 0ex
    \rightmargin 0em
    \listparindent 0em
    \itemindent 0em
    \settowidth{\labelwidth}{Hello}
    \@savelistparams  % save our list parameters
    \list{}{\@restorelistparams % override any list{} changes
				% to our globals
    \iedlistdecl % let user alter parameters 
    \skip 15pt
    #1\relax
    \ifnolabelindentfactor\relax
    \else \labelindent=\labelindentfactor\labelindent
    \fi
    \ifnocalcleftmargin \relax
    \else \calcleftmargin{\labelindent} 
    \fi
    % justify the label appropriately
    \let\makelabel\@iedmakelabelleft   % left if don't know
                                       % what else to do 
    \ifnum \@iedjustify =1 \let\makelabel\@iedmakelabelcenter \fi
    \ifnum \@iedjustify =2 \let\makelabel\@iedmakelabelright  \fi}
\fi}%
{\endlist}

\def\@iedmakelabelleft#1{\makebox[\labelwidth][l]{\normalfont #1}}
\def\@iedmakelabelright#1{\makebox[\labelwidth][r]{\normalfont #1}}
\def\@iedmakelabelcenter#1{\makebox[\labelwidth][c]{\normalfont #1}}



%editorial main text definition 2005/7/20
\newenvironment{editorial}[2]{%
   \newlength{\lineskiplength}
     \setlength{\lineskiplength}{#1}
     \lineskiplength=1.143\lineskiplength% if font size is 10.5pt, baselineskip is 12pt (same article)
  \if@twocolumn%%default
  \fontsize{#1}{\lineskiplength}\selectfont
  \else%%single column case
  \newlength{\editorialtextwidth}
    \setlength{\editorialtextwidth}{#2}
   \newlength{\halfskip}
    \setlength{\halfskip}{\textwidth}
  \advance\halfskip by -\editorialtextwidth 
  \divide\halfskip by 2 
 \bgroup\setlength{\rightskip}{\halfskip} \setlength{\leftskip}{\halfskip}
 \vspace{-0.8em}\fontsize{#1}{\lineskiplength}\selectfont
\fi}
  {\vspace{0.6em}\par
   \if@twocolumn\else\egroup\endquotation\fi
   \normalfont\normalsize}




%%editorial main text definition 2005/7/20
%\def\@Editorial#1#2{\@ifstar{}{\@twocolumntrue}}
%\newenvironment{Editorial}[2]{%
%  \if@twocolumn%%default
%  \normalsize
%  \else%%single column case
%  \newlength{\editorialtextwidth}
%    \setlength{\editorialtextwidth}{#2}
%   \newlength{\halfskip}
%    \setlength{\halfskip}{\textwidth}
%  \advance\halfskip by -\editorialtextwidth 
%  \divide\halfskip by 2 
% \bgroup\setlength{\rightskip}{\halfskip} \setlength{\leftskip}{\halfskip}
% \vspace{-0.8em}\fontsize{#1}{12pt}\selectfont
%  \fi}
%  {\vspace{0.6em}\par
%   \if@twocolumn\else\egroup\endquotation\fi
%   \normalfont\normalsize}



%%abstract definition
\newenvironment{abstract}{%
  \if@twocolumn%%default
  \normalsize\bfseries\noindent
  \else%%single column case

  \begin{center}\vspace{-0.8em}{\fontsize{10.5pt}{12pt}\selectfont\textbf{Abstract}\normalfont}\end{center}\bfseries 
 

  \fi}
  {\vspace{0.6em}\par
   \if@twocolumn\else\endquotation\fi
   \normalfont\normalsize}


\newenvironment{keywords}{
  % JACIII uses the term (in bold italics) "Index Terms" now. 
  \if@twocolumn
    \vspace{18pt}    % Useful!! 
    \noindent\textbf{Keywords: }$\!$%
  \else
    \begin{center}\small\bfseries Index Terms\end{center}\quotation\small
  \fi}
  {%
   \par\if@twocolumn\else\endquotation\fi
   \normalsize\normalfont}

\newenvironment{verse}
               {\let\\\@centercr
                \list{}{\itemsep      \z@
                        \itemindent   -1.5em
                        \listparindent\itemindent
                        \rightmargin  \leftmargin
                        \advance\leftmargin 1.5em}%
                \item\relax}
               {\endlist}
               
\newenvironment{quotation}
               {\list{}{\listparindent 1.5em
                        \itemindent    \listparindent
                        \rightmargin   \leftmargin
                        \parsep        0pt \@plus 1pt}
                \item\relax}
               {\endlist}
\newenvironment{quote}
               {\list{}{\rightmargin\leftmargin}%
                \item\relax}
               {\endlist}

\if@compatibility
\newenvironment{titlepage}
    {%
      \if@twocolumn
        \@restonecoltrue\onecolumn
      \else
        \@restonecolfalse\newpage
      \fi
      \thispagestyle{empty}%
      \setcounter{page}\z@
    }%
    {\if@restonecol\twocolumn \else \newpage \fi
    }
\else
\newenvironment{titlepage}
    {%
      \if@twocolumn
        \@restonecoltrue\onecolumn
      \else
        \@restonecolfalse\newpage
      \fi
      \thispagestyle{empty}%
      \setcounter{page}\@ne
    }%
    {\if@restonecol\twocolumn \else \newpage \fi
     \if@twoside\else
        \setcounter{page}\@ne
     \fi
    }
\fi

\newcommand\appendix[1][Appendix]{\par
  \setcounter{section}{0}%
  \setcounter{subsection}{0}%
  \setcounter{subsubsection}{0}
  \setcounter{paragraph}{0}
  \gdef\thesection{Appendix \@Alph\c@section}
  \gdef\thesubsection{\@Alph\c@section.\@arabic\c@subsection}
  \normalsize
}

\setlength\arraycolsep    {5pt}
\setlength\tabcolsep      {6pt}
\setlength\arrayrulewidth {.4pt}
\setlength\doublerulesep  {2pt}
\setlength\tabbingsep{\labelsep}


\skip\footins 10pt plus 4pt minus 2pt
\footnotesep 3pt%separation length between footnotes
\footskip 32pt
\skip\@mpfootins = \skip\footins
\setlength\fboxsep{3pt}
\setlength\fboxrule{.4pt}

%%%%%% Dotted equation number environment definition (2004/02/06 Y.K) %%%%
%
%To remove the leaders, delete "\leaders". (2007/2/9 K.O. and Y.K.)

\newcommand\EqnDots{\leaders\hbox{\kern4\p@ .\kern4\p@}\hfill}
\@ifundefined{mathindent}{\newdimen\mathindent \mathindent\leftmargini}{}
\renewcommand{\[}{\relax \ifmmode\@badmath \else
 \begin{trivlist}%
  \@beginparpenalty\predisplaypenalty \@endparpenalty\postdisplaypenalty
  \item[]\leavevmode \hbox to\linewidth\bgroup $\m@th\displaystyle %$
  \hskip\mathindent\bgroup
 \fi}
\renewcommand{\]}{\relax\ifmmode \egroup $\hfil% $
    \egroup \end{trivlist}%
  \else \@badmath \fi}
\renewenvironment{equation}%
 {\@beginparpenalty\predisplaypenalty \@endparpenalty\postdisplaypenalty
     \refstepcounter{equation}\trivlist \item[]\leavevmode
       \hbox to\linewidth\bgroup $\m@th% $
         \displaystyle \hskip\mathindent}%
 {$\EqnDots % $   Replace `\hfil' with dotted leaders `\EqnDots'.
     \displaywidth\linewidth\hbox{\@eqnnum}\egroup \endtrivlist}
\renewenvironment{eqnarray}{%
   \stepcounter{equation}%
   \def\@currentlabel{\p@equation\theequation}%
   \global\@eqnswtrue \m@th \global\@eqcnt\z@  \tabskip\mathindent
   \let\\\@eqncr \setlength\abovedisplayskip\topsep
   \ifvmode \addtolength\abovedisplayskip\partopsep \fi
   \addtolength\abovedisplayskip\parskip
   \setlength\belowdisplayskip\abovedisplayskip
   \setlength\belowdisplayshortskip\abovedisplayskip
   \setlength\abovedisplayshortskip\abovedisplayskip
   $$\everycr{}\halign to\linewidth% $$
   \bgroup
     \hskip\@centering
     $\displaystyle\tabskip\z@skip{##}$\@eqnsel&%
     \global\@eqcnt\@ne \hfil${\hskip\tw@\eqarcolsep##\hskip\tw@\eqarcolsep}$\hfil&%
%    \global\@eqcnt\@ne \hfil${\DEQ@acs##\DEQ@acs}$\hfil&%
     \global\@eqcnt\tw@ $\displaystyle{##}$\hskip\@centering\cr%
 }% end of "\begin" part
 {\@@eqncr
   \noalign{% vertical skip up to overlay phantom line
      \penalty\@M \vskip-\prevdepth
      \edef\@tempa{\omit\span\omit\span\omit   % span three columns
        \vrule\@depth\the\prevdepth \@width\z@ % strut of proper depth
        \kern-\mathindent \kern\linewidth}%    % full line width
      \nointerlineskip \expandafter % use saved |\@tempa| outside group
   }\@tempa\cr
   \egroup
   \global\advance\c@equation\m@ne$$% $$
   \global\@ignoretrue
 }
\def\@@eqncr{\let\reserved@a\@empty
   \ifcase\@eqcnt \def\reserved@a{& &}\or \def\reserved@a{&}\fi
   \reserved@a
   \if@eqnsw \egroup $\EqnDots \@eqnnum $\bgroup \stepcounter{equation}%
   \fi \global\@eqnswtrue\global\@eqcnt\z@\cr}
\def\DEQ@acs{\hskip\tw@\arraycolsep}

%\renewcommand \theequation {\@arabic\c@equation}


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\newcounter{figure}
\renewcommand \thefigure {\@arabic\c@figure}
\def\fps@figure{tbp}
\def\ftype@figure{1}
\def\ext@figure{lof}

\def\fnum@figure{\textbf{Fig.~\thefigure.~}}

\newenvironment{figure}
               {\@float{figure}}
               {\end@float}
\newenvironment{figure*}
               {\@dblfloat{figure}}
               {\end@dblfloat}

\newcounter{table}
\renewcommand\thetable{\@arabic\c@table}
\def\fps@table{tbp}
\def\ftype@table{2}
\def\ext@table{lot}

\def\fnum@table{\textbf{Table~\thetable.~}}

\newenvironment{table}
               {\@float{table}}
               {\end@float}
\newenvironment{table*}
               {\@dblfloat{table}}
               {\end@dblfloat}

\newlength\abovecaptionskip
\newlength\belowcaptionskip
\setlength\abovecaptionskip{10\p@}
\setlength\belowcaptionskip{10\p@}


%% caption configuration added by (T.O 2003/12/05)
\newlength\figcaptionindent
\setlength\figcaptionindent{10\p@}

%\makeatletter 
\long\def\@makecaption#1#2{%
  \vskip\abovecaptionskip
  \sbox\@tempboxa{\small #1 #2}%
  \ifdim \wd\@tempboxa>\hsize %-2\figcaptionindent%   
    \sbox\@tempboxa{\small #1 #2}%
    \@tempdima\hsize \advance\@tempdima-2\figcaptionindent
    \hskip\figcaptionindent \parbox[t]{\@tempdima}{\small #1 #2}\relax\par
 \else
    \global \@minipagefalse
    \hbox to\hsize{\hfil\box\@tempboxa\hfil}
  \fi
  \vskip\belowcaptionskip}
%\makeatother

% &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&



\newcommand\appendices{\par
  \setcounter{section}{-1} % we want \refstepcounter to use section 0
  \setcounter{subsection}{0}
  \setcounter{subsubsection}{0}
  \setcounter{paragraph}{0}
  \ifuseRomanappendices
    \newcommand\thesection{\Roman{section}}
    \newcommand\thesectiondis{\Roman{section}}
  \else
    \newcommand\thesection{\Alph{section}}
    \newcommand\thesectiondis{\Alph{section}}
  \fi
  \refstepcounter{section} % update the \ref counter
  \setcounter{section}{0} % NEXT \section will be the FIRST appendix
  % redefine \section command for appendices
  % leave \section* as is
  \newcommand\section{
    \@ifstar{\@ppendixsavesection*}{% process the *-form
      \refstepcounter{section} % or is a new section so,
      \@processthesectionargument
    }
  }% process the argument of the normal form
}


\def\CMPARstart#1#2{\begingroup\def\par{\endgraf\endgroup\lineskiplimit=0pt}
    \setbox2=\hbox{\uppercase{#2} }\newdimen\tmpht \tmpht \ht2
    \advance\tmpht by \baselineskip\font\hhuge=cmr10 at \tmpht
    \setbox1=\hbox{{\hhuge #1}}
    \count7=\tmpht \count8=\ht1\divide\count8 by 1000 \divide\count7 by\count8
    \tmpht=.001\tmpht\multiply\tmpht by \count7\font\hhuge=cmbx10 at \tmpht
    \setbox1=\hbox{{\hhuge #1}} \noindent \hangindent1.05\wd1
    \hangafter=-2 {\hskip-\hangindent \lower1\ht1\hbox{\raise1.0\ht2\copy1}%
    \kern-0\wd1}\copy2\lineskiplimit=-1000pt}


\def\PARstart#1#2{\begingroup\def\par{\endgraf\endgroup\lineskiplimit=0pt}
    \setbox2=\hbox{\uppercase{#2}}\newdimen\tmpht \tmpht \ht2
    \advance\tmpht by 1.1\baselineskip\font\hhuge=ptmr at \tmpht
    \setbox1=\hbox{{\hhuge #1}}
    \count7=\tmpht \count8=\ht1\divide\count8 by 1000 \divide\count7 by\count8
    \tmpht=.001\tmpht\multiply\tmpht by \count7\font\hhuge=ptmb at \tmpht
    \setbox1=\hbox{{\hhuge #1}} \noindent \hangindent1.05\wd1
    \hangafter=-2 {\hskip-\hangindent \lower1\ht1\hbox{\raise1.0\ht2\copy1}%
    \kern-0\wd1}\copy2\lineskiplimit=-1000pt}

\if@technote\def\PARstart#1#2{#1#2}\def\CMPARstart#1#2{#1#2}\fi     % if technical note, disable it
\if@draftclsmode\def\PARstart#1#2{#1#2}\def\CMPARstart#1#2{#1#2}\fi % if draft, disable it

%&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


\newenvironment{biography}[2][]{%
  \addcontentsline{toc}{section}{Biography}
  \footnotesize\unitlength 1in\bigskip\parskip=0pt\par%
  \rule{0pt}{1.54in}\vspace{-1.54in}\par%   guarantees correct page breaking
  \noindent
  % the default box for where the photo goes
  \def\@tempbiographybox{
    \hbox{
      \framebox(1,1.25){
         \parbox[][\height][c]{0.9in}{
           \centering PLACE\\ PHOTO\\ HERE
         }
       } 
     }
  }%
  \@ifmtarg{#1}{\relax}{%
    %   % The user supplied the optional argument
    %   % override the default box with what they want
    \def\@tempbiographybox{
      \hbox{%
        \begin{minipage}[b][1.25in][c]{1in}%
        \centering
        #1%
        \end{minipage}
      }
    }%
  }% end if optional argument supplied
  \setbox0\@tempbiographybox%
  \ht0=1.45in\count10=\ht0\divide\count10 by\baselineskip%  calculates lines
  \global\hangindent1.14in\global\hangafter-\count10%
  \hskip-1.12in\setbox0\hbox to 1.12in {\raise-1.2in\box0\hss}%
  \dp0=0in\ht0=0in\box0\noindent{\bfseries#2}\rmfamily
} 
{
  \par
  \ifnum \prevgraf <\count10 % detect when the biography text is shorter than the photo
    \count11=\count10
    \advance\count11 by -\prevgraf % calculate how many lines we need to pad
    \dimen10=\baselineskip % calculate the length of the padding
    \multiply\dimen10 by \count11
    \noindent\rule{0pt}{\dimen10} % insert an invisible support strut
  \fi
  \par\normalfont
}




\DeclareOldFontCommand{\rm}{\normalfont\rmfamily}{\mathrm}
\DeclareOldFontCommand{\sf}{\normalfont\sffamily}{\mathsf}
\DeclareOldFontCommand{\tt}{\normalfont\ttfamily}{\mathtt}
\DeclareOldFontCommand{\bf}{\normalfont\bfseries}{\mathbf}
\DeclareOldFontCommand{\it}{\normalfont\itshape}{\mathit}
\DeclareOldFontCommand{\sl}{\normalfont\slshape}{\@nomath\sl}
\DeclareOldFontCommand{\sc}{\normalfont\scshape}{\@nomath\sc}
\DeclareRobustCommand*\cal{\@fontswitch\relax\mathcal}
\DeclareRobustCommand*\mit{\@fontswitch\relax\mathnormal}


\newcommand\@pnumwidth{1.55em}
\newcommand\@tocrmarg{2.55em}
\newcommand\@dotsep{4.5}
\setcounter{tocdepth}{3}

\def\@specialpapernotice{\relax}


\def\specialpapernotice#1{\def\@specialpapernotice{%
\\*[1.5ex]\textit{#1}\vspace*{-2ex}}}

\newcommand\tableofcontents{\ssection*{Contents}\@starttoc{toc}}


\newcommand*\l@section[2]{%
  \addpenalty\@secpenalty
  \addvspace{1.0em \@plus 1pt}%
  \setlength\@tempdima{2.75em}%
  \begingroup
    \parindent \z@ \rightskip \@pnumwidth
    \parfillskip -\@pnumwidth
    {\bfseries\leavevmode #1}
    \hfil\hbox to\@pnumwidth{\hss #2} \par 
  \endgroup}

\newcommand*\l@subsection{\@dottedtocline{2}{2.75em}{3.75em}}
\newcommand*\l@subsubsection{\@dottedtocline{3}{6.5em}{4.5em}}
\newcommand*\l@paragraph{\@dottedtocline{4}{6.5em}{5.5em}}
\newcommand*\l@subparagraph{\@dottedtocline{5}{6.5em}{6.5em}}


\newdimen\tmpitemindent
\newcommand\QED{\mbox{\rule[0pt]{1.5ex}{1.5ex}}}


\newenvironment{proof}{ 
  \noindent\hspace{2em}{\itshape Proof: }
}
   {\hspace*{\fill}~\QED\par\endtrivlist\unskip}
  
  
\def\@begintheorem#1#2{\tmpitemindent\itemindent\topsep 0pt\rmfamily\trivlist
    \item[\hskip \labelsep{\indent\itshape #1\ #2:}]\itemindent\tmpitemindent}
\def\@opargbegintheorem#1#2#3{\tmpitemindent\itemindent\topsep 0pt\rmfamily \trivlist

\item[\hskip\labelsep{\indent\itshape #1\ #2\rmfamily---#3:}]\itemindent\tmpitemindent}
  \def\@endtheorem{\endtrivlist\unskip}
  
  
  \newcommand\listoffigures{%
    \ssection*{\listfigurename
      \@mkboth{\MakeUppercase\listfigurename}%
              {\MakeUppercase\listfigurename}}%
    \@starttoc{lof}%
  }
  
  \newcommand*\l@figure{\@dottedtocline{1}{0em}{2.75em}}
  
  
  \newcommand\listoftables{\ssection*{List of Tables}\@starttoc{lot}}
  \let\l@table\l@figure
  
  

\newdimen\bibindent
\setlength\bibindent{1.5em}
\newenvironment{thebibliography}[1]{
  \ssection*{\small References:} 
  \addcontentsline{toc}{section}{References}
  \vspace*{-10pt}
  \renewcommand\baselinestretch{1}
  \footnotesize
  \setlength{\itemindent}{12pt}
  \setlength{\labelwidth}{3em}
  \setlength{\labelsep}{5pt}
  \list{[\arabic{enumi}]}{
    \advance\leftmargin\labelsep 
    \itemsep 0pt plus .5pt
    \usecounter{enumi}}
  \def\newblock{\hskip .11em plus .33em minus .07em}
  \if@technote 
  \sloppy\clubpenalty4000\widowpenalty4000\interlinepenalty100%
  \else 
  \sloppy\clubpenalty4000\widowpenalty4000\interlinepenalty500
  \fi%
  \sfcode`\.=1000\relax}{\endlist}


\newcommand\newblock{\hskip .11em\@plus.33em\@minus.07em}

\let\@openbib@code\@empty
\newenvironment{theindex}
               {\if@twocolumn
                 \@restonecolfalse
                \else
                  \@restonecoltrue
                \fi
                \columnseprule \z@
                \columnsep 35\p@
                \twocolumn[\ssection*{\indexname}]%
                \@mkboth{\MakeUppercase\indexname}%
                        {\MakeUppercase\indexname}%
                \thispagestyle{plain}\parindent\z@
                \parskip\z@ \@plus .3\p@\relax
                \let\item\@idxitem}
               {\if@restonecol\onecolumn\else\clearpage\fi}
\newcommand\@idxitem{\par\hangindent 40\p@}
\newcommand\subitem{\@idxitem \hspace*{20\p@}}
\newcommand\subsubitem{\@idxitem \hspace*{30\p@}}
\newcommand\indexspace{\par \vskip 10\p@ \@plus5\p@ \@minus3\p@\relax}

\renewcommand\footnoterule{\vspace*{5pt}\noindent\rule{25.0mm}{0.4pt} \vspace*{3pt}}

%\newcommand\@makefntext[1]{%
%  \parindent 0em%\parindent 0.8em
%  \indent${\@thefnmark}$. #1}

%\newcommand\@makefntext[1]{%
%  \setlength{\parindent}{0em}%
%  \setlength{\itemindent}{0pt}%
%  \setlength{\labelwidth}{1em}%
%  \setlength{\labelsep}{.5em}%margin between counter and text
%  \begin{list}{\hspace*{-20pt}$\@thefnmark$.}{}%
%  \item \noindent#1%
%  \end{list}%
%}

\long\def\@makefntext#1{\parindent 1.5em\noindent\@hangfrom{\hbox to 1.2em{\hss$\@thefnmark$.\hspace*{.5em}}}#1}


\newcommand\listfigurename{List of Figures}
\newcommand\indexname{Index}
\newcommand\figurename{Figure}

\def\today{\ifcase\month\or
  January\or February\or March\or April\or May\or June\or
  July\or August\or September\or October\or November\or December\fi
  \space\number\day, \number\year}

\setlength\columnseprule{0\p@}

\pagestyle{plain}
\pagenumbering{arabic}

\if@twoside
\else
  \raggedbottom
\fi
\if@twocolumn
  \twocolumn
  \sloppy
  \flushbottom
\else
  \onecolumn
\fi

%%%%%%%%%%%%%%%%% profile configuration %%%%%%%%%%%%%%%%%%%%%%%%%%%

\newif \if@proifname \@proifnamefalse
\newif \if@proifaffiliation \@proifaffiliationfalse
\newif \if@proifaddress \@proifaddressfalse
\newif \if@proifhistory \@proifhistoryfalse
\newif \if@proifworks \@proifworksfalse
\newif \if@proifmembership \@proifmembershipfalse
\newif \if@proifphoto \@proifphotofalse

\newcommand{\Name}[1]{\def\pro@name{#1} \@proifnametrue}
\newcommand{\Affiliation}[1]{\def\pro@affiliation{#1} \@proifaffiliationtrue}
\newcommand{\Address}[1]{\def\pro@address{#1} \@proifaddresstrue}
\newcommand{\History}[1]{\def\pro@history{#1} \@proifhistorytrue}
\newcommand{\Works}[1]{\def\pro@works{#1} \@proifworkstrue}
\newcommand{\Membership}[1]{\def\pro@membership{#1} \@proifmembershiptrue}
\newcommand{\Photo}[1][Place Photo Here]{\def\pro@photo{#1} \@proifphototrue}

\newenvironment{profile}{
  \def\name{\pro@name}
  \def\affiliation{\pro@affiliation}
  \def\address{\pro@address}
  \def\history{\pro@history}
  \def\works{\pro@works}
  \def\membership{\pro@membership}
  \def\photo{\pro@photo}
} %% End of Storing parameters for THIS profile
	       {%%%Define Profile output
		 \if@doubleskip\renewcommand\baselinestretch{1}\fi
		 \if@profile
		   \begin{flushleft}
%		     \rule{240pt}{1pt}\\	%Comment Out 2005/7/29
		     \vbox{%
		    \noindent\rule{240pt}{1pt}\\  % Add 2005/7/29
                      \vspace*{-3mm}              % Add 2005/7/29
		       \hbox{%
			 \noindent%
		       \begin{minipage}[t]{70.86pt}%
			 \setlength{\unitlength}{1pt}%
%			 \vspace*{1pc}%
%			 \vspace*{5pt}%
			 \vspace*{10pt}
			 \makebox(70.86,93.54)[c]{\if@proifphoto\photo\fi}
		       \end{minipage}\hspace*{14.16pt}%
		       \begin{minipage}[t]{154.98pt}%240pt-(70.86+14.16)
			 \vspace*{1pc}%
			 \vbox{\hsize=154.98pt \baselineskip 9.2pt

			   \if@proifname
			       {\fontsize{9pt}{10.35pt}\selectfont\bfseries%
				 Name: \\ \normalfont}%
			       {\fontsize{8pt}{9.2pt}\selectfont%
				 \name \normalfont}
			       \fi

			   \vspace*{1pc}%
			   \if@proifaffiliation%
			       {\fontsize{9pt}{10.35pt}\selectfont\bfseries%
				 Affiliation:\\ \normalfont}%
			       {\fontsize{8pt}{9.2pt}\selectfont%
				 \affiliation \\ \normalfont}%
			       %\vspace*{46pt}%9.2pt times 5 lines %Comment Out 2005/7/29
			       \fi
			 }
		       \end{minipage}%
		     }% end of hbox
		     \vbox{\hsize=240pt \baselineskip 9.2pt% 
                      \vspace{7pt}%% Add 2005/7/29
		       \if@proifaddress%
			   {\fontsize{9.0pt}{10.35pt}\selectfont\bfseries%
			     \noindent Address:\\ \normalfont}%
			   {\fontsize{8.0pt}{9.2pt}\selectfont%
			     \address \\ \normalfont}%
			\fi%
			\if@proifhistory%
			   {\fontsize{9.0pt}{10.35pt}\selectfont\bfseries%
			     Brief Biographical History: \\ \normalfont}%
			   {\fontsize{8.0pt}{9.2pt}\selectfont%
			     \history \\ \normalfont}%
			\fi%
			\if@proifworks%
			    {\fontsize{9.0pt}{10.35pt}\selectfont\bfseries%
			      Main Works: \\ \normalfont}%
			    {\fontsize{8.0pt}{9.2pt}\selectfont%
			      \works \\ \normalfont}%
			\fi%
			\if@proifmembership%
			    {\fontsize{9.0pt}{10.35pt}\selectfont\bfseries%
			      Membership in Academic Societies: \\ \normalfont}%
			    {\fontsize{8.0pt}{9.2pt}\selectfont%
			      \membership  \normalfont}%
			 \fi%
		       \vspace*{-5pt}% 1pica from the end of profile to the horizontal line
%		       \vspace*{1pc}% 1pica from the end of profile to the horizontal line
		     }%end of the lower box  
		     \noindent\rule{240pt}{1pt}
		     }% end of vbox
		   \end{flushleft}%
		   \fi%%end of if@profile
	       }% End of Profile output definition 
	       
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%	       
%%Output for FINDER data (OFIND) 2006/1/6 by uchino
%%Reference : 
%% Jeff Goldberg, ``latspage.dtx,'' 
%% http://www.tug.org/tex-archive/macros/latex/contrib/lastpage/lastpage.dtx
\def\lastpage@putlabel{\addtocounter{page}{-1}%
  \immediate\write\@auxout{%
   \string\newlabel{Kind}{\@articlekindOut}^^J%
%   \string\newlabel{StartPage}{\@startpageOut}^^J
   \string\newlabel{LastPage}{\thepage}^^J%
  % \string\newlabel{Receive}{\protect\@receiveOut}
  % \string\newlabel{Accept}{\@acceptOut}
   \string\newlabel{Language}{\@languageOut}^^J%
 }%
  \addtocounter{page}{1}}
\AtEndDocument{%
  \message{AED: lastpage setting LastPage}%
   \clearpage\lastpage@putlabel
}%     
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  



\endinput



%%
%% End of file `conferencearticle.cls'.
