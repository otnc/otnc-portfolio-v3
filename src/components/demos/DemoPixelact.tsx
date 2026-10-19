import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/pixelact-ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/pixelact-ui/avatar';
import { Badge } from '@/components/ui/pixelact-ui/badge';
import { Button } from '@/components/ui/pixelact-ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/pixelact-ui/card';
import '@/components/ui/pixelact-ui/button.css';
import { accounts, altPersona, profile, supports, works } from '@/data/profile';

export default function DemoPixelact() {
	return (
		<main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-[280px_1fr]">
			<aside className="flex flex-col gap-6">
				<Card>
					<CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
						<Avatar size="large">
							<AvatarImage src={profile.avatar} alt="" />
							<AvatarFallback>猫</AvatarFallback>
						</Avatar>
						<div>
							<h1 className="pixel-font text-2xl">{profile.name}</h1>
							<p className="text-muted-foreground mt-1 text-sm">{profile.reading} / {profile.handle}</p>
						</div>
						<p className="text-sm">{profile.tagline}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>アカウント</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-3">
						{accounts.map((account) => (
							<Button key={account.url} asChild variant="default" className="w-full justify-start">
								<a href={account.url} target="_blank" rel="noreferrer">
									{account.label}
								</a>
							</Button>
						))}
					</CardContent>
				</Card>
			</aside>

			<div className="flex flex-col gap-8">
				<Card>
					<CardHeader>
						<CardTitle>じこしょうかい</CardTitle>
						<CardDescription className="jp-text">{profile.bio}</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						{profile.roles.map((role) => (
							<Badge key={role} variant="secondary" font="normal">
								{role}
							</Badge>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>さくひん</CardTitle>
					</CardHeader>
					<CardContent>
						<Accordion type="single" collapsible defaultValue={works[0].name}>
							{works.map((work) => (
								<AccordionItem key={work.name} value={work.name}>
									<AccordionTrigger>
										{work.name} <span className="text-muted-foreground ml-2 text-xs">[{work.kind}]</span>
									</AccordionTrigger>
									<AccordionContent className="jp-text flex flex-col gap-3">
										<p>{work.description}</p>
										<div className="flex flex-wrap gap-3">
											<Button asChild size="sm" variant="success">
												<a href={work.url} target="_blank" rel="noreferrer">
													ひらく
												</a>
											</Button>
											<Button asChild size="sm" variant="secondary">
												<a href={work.repo} target="_blank" rel="noreferrer">
													コード
												</a>
											</Button>
										</div>
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</CardContent>
				</Card>

				<Card className="bg-primary text-primary-foreground">
					<CardHeader>
						<CardTitle>2P がログインしました</CardTitle>
						<CardDescription className="jp-text text-primary-foreground">{altPersona.summary}</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-3">
						<Button asChild variant="warning">
							<a href={altPersona.twitter.url} target="_blank" rel="noreferrer">
								{altPersona.twitter.handle}
							</a>
						</Button>
						<Button asChild variant="default">
							<a href={altPersona.site.url} target="_blank" rel="noreferrer">
								{altPersona.site.label}
							</a>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>しえん</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-3">
						{supports.map((support) => (
							<Button key={support.url} asChild size="sm" variant="default">
								<a href={support.url} target="_blank" rel="noreferrer">
									{support.label}
								</a>
							</Button>
						))}
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
