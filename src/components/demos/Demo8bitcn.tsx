import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/8bit/avatar';
import { Badge } from '@/components/ui/8bit/badge';
import { Button } from '@/components/ui/8bit/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/8bit/card';
import HealthBar from '@/components/ui/8bit/health-bar';
import XpBar from '@/components/ui/8bit/xp-bar';
import { accounts, altPersona, profile, supports, works } from '@/data/profile';

export default function Demo8bitcn() {
	return (
		<main className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-10">
			<section className="flex flex-col items-center gap-6 text-center">
				<Avatar className="size-28">
					<AvatarImage src={profile.avatar} alt="" />
					<AvatarFallback>猫</AvatarFallback>
				</Avatar>
				<div>
					<p className="text-muted-foreground text-sm">PLAYER 1</p>
					<h1 className="retro mt-2 text-3xl">{profile.name}</h1>
					<p className="mt-3">{profile.tagline}</p>
				</div>
				<div className="flex flex-wrap justify-center gap-3">
					{profile.roles.map((role) => (
						<Badge key={role}>{role}</Badge>
					))}
				</div>
			</section>

			<Card>
				<CardHeader>
					<CardTitle>ステータス</CardTitle>
					<CardDescription font="normal">{profile.bio}</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					<div>
						<p className="mb-1 text-sm">HP (ネタ力)</p>
						<HealthBar value={92} variant="retro" />
					</div>
					<div>
						<p className="mb-1 text-sm">XP (OSS 経験値)</p>
						<XpBar value={68} variant="retro" />
					</div>
					<div className="flex flex-wrap gap-2 pt-2">
						{profile.skills.map((skill) => (
							<Badge key={skill} variant="outline" font="normal">
								{skill}
							</Badge>
						))}
					</div>
				</CardContent>
			</Card>

			<section>
				<h2 className="retro mb-6 text-xl">アイテム (作品)</h2>
				<div className="grid gap-8 sm:grid-cols-2">
					{works.map((work) => (
						<Card key={work.name}>
							<CardHeader>
								<CardTitle className="text-sm">{work.name}</CardTitle>
								<CardDescription font="normal">{work.description}</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-wrap items-center gap-4">
								<Badge variant="secondary" font="normal">
									{work.kind}
								</Badge>
								<Button asChild size="sm">
									<a href={work.url} target="_blank" rel="noreferrer">
										ひらく
									</a>
								</Button>
								<Button asChild size="sm" variant="outline">
									<a href={work.repo} target="_blank" rel="noreferrer">
										コード
									</a>
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<Card className="bg-accent text-accent-foreground">
				<CardHeader>
					<CardTitle>ワープゾーン発見!</CardTitle>
					<CardDescription font="normal" className="text-accent-foreground">{altPersona.summary}</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-wrap gap-4">
					<Button asChild>
						<a href={altPersona.twitter.url} target="_blank" rel="noreferrer">
							{altPersona.twitter.handle} へワープ
						</a>
					</Button>
					<Button asChild variant="outline">
						<a href={altPersona.site.url} target="_blank" rel="noreferrer">
							{altPersona.site.label} へワープ
						</a>
					</Button>
				</CardContent>
			</Card>

			<section className="grid gap-8 sm:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>アカウント</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-2">
						{accounts.map((account) => (
							<a key={account.url} href={account.url} target="_blank" rel="noreferrer" className="hover:text-primary">
								▶ {account.label} <span className="text-muted-foreground">{account.handle}</span>
							</a>
						))}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>課金 (支援)</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-2">
						{supports.map((support) => (
							<a key={support.url} href={support.url} target="_blank" rel="noreferrer" className="hover:text-primary">
								▶ {support.label}
							</a>
						))}
					</CardContent>
				</Card>
			</section>
		</main>
	);
}
