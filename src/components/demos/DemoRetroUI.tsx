import { Bubble, Button, Card, ProgressBar } from 'pixel-retroui';
import 'pixel-retroui/dist/index.css';
import 'pixel-retroui/dist/fonts.css';
import { accounts, altPersona, profile, supports, works } from '@/data/profile';
import './demo-retroui.css';

// pixel-retroui's Button renders a <button>, so links open via onClick.
function openLink(url: string) {
	window.open(url, '_blank', 'noopener');
}

export default function DemoRetroUI() {
	return (
		<main className="rui">
			<section className="rui-hero">
				<Bubble direction="right" bg="#fefcd0">
					やあ、{profile.name} です!
				</Bubble>
				<img className="rui-avatar" src={profile.avatar} alt="" width={120} height={120} />
				<h1>{profile.name}</h1>
				<p>{profile.tagline}</p>
				<div className="rui-row">
					<Button bg="#fefcd0" onClick={() => openLink(accounts[0].url)}>
						GitHub
					</Button>
					<Button bg="#c381b5" textColor="#fefcd0" onClick={() => openLink(accounts[1].url)}>
						Twitter
					</Button>
				</div>
			</section>

			<Card className="rui-card" bg="#fefcd0">
				<h2>About</h2>
				<p>{profile.bio}</p>
				<ul className="rui-tags">
					{profile.roles.map((role) => (
						<li key={role}>{role}</li>
					))}
				</ul>
				<p className="rui-label">好きな言語の熟練度</p>
				<ProgressBar progress={90} size="md" color="#c381b5" />
			</Card>

			<h2 className="rui-heading">Works</h2>
			<div className="rui-grid">
				{works.map((work) => (
					<Card key={work.name} className="rui-card" bg="#ffffff">
						<p className="rui-kind">{work.kind}</p>
						<h3>{work.name}</h3>
						<p>{work.description}</p>
						<div className="rui-row">
							<Button bg="#fefcd0" onClick={() => openLink(work.url)}>
								ひらく
							</Button>
							<Button bg="#ffffff" onClick={() => openLink(work.repo)}>
								コード
							</Button>
						</div>
					</Card>
				))}
			</div>

			<Card className="rui-card rui-warp" bg="#c381b5" textColor="#fefcd0">
				<h2>ひみつの扉</h2>
				<p>{altPersona.summary}</p>
				<div className="rui-row">
					<Button bg="#fefcd0" onClick={() => openLink(altPersona.twitter.url)}>
						{altPersona.twitter.handle}
					</Button>
					<Button bg="#fefcd0" onClick={() => openLink(altPersona.site.url)}>
						{altPersona.site.label}
					</Button>
				</div>
			</Card>

			<div className="rui-grid">
				<Card className="rui-card" bg="#fefcd0">
					<h2>Links</h2>
					<ul className="rui-links">
						{accounts.map((account) => (
							<li key={account.url}>
								<a href={account.url} target="_blank" rel="noreferrer">
									{account.label} <small>{account.handle}</small>
								</a>
							</li>
						))}
					</ul>
				</Card>
				<Card className="rui-card" bg="#fefcd0">
					<h2>Support</h2>
					<ul className="rui-links">
						{supports.map((support) => (
							<li key={support.url}>
								<a href={support.url} target="_blank" rel="noreferrer">
									{support.label}
								</a>
							</li>
						))}
					</ul>
				</Card>
			</div>
		</main>
	);
}
