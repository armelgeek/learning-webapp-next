'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Eye, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  replyCount: number;
  viewCount: number;
}

interface RecentForumActivityProps {
  topics: ForumTopic[];
  targetLanguage: string;
}

export function RecentForumActivity({ topics, targetLanguage }: RecentForumActivityProps) {
  if (topics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Forum Activity
          </CardTitle>
          <CardDescription>
            No recent forum activity for {targetLanguage}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/forum">
              Visit Forum
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Recent Forum Activity
        </CardTitle>
        <CardDescription>
          Popular discussions in the {targetLanguage} community
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {topics.map((topic) => (
          <div key={topic.id} className="border-b last:border-b-0 pb-3 last:pb-0">
            <div className="space-y-2">
              <Link 
                href={`/forum/topics/${topic.id}`}
                className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
              >
                {topic.title}
              </Link>
              
              <p className="text-xs text-muted-foreground line-clamp-2">
                {topic.content.length > 100 
                  ? `${topic.content.substring(0, 100)}...` 
                  : topic.content
                }
              </p>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{topic.replyCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{topic.viewCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-2">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/forum">
              View All Topics
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}