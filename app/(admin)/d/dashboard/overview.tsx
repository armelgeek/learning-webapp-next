import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import React from 'react';
import { BookOpen, Users, Award, MessageSquare } from 'lucide-react';
import { ContentGenerator } from '@/features/generators/components/organisms/content-generator';

export default async function Overview() {

    return (
        <div className='space-y-4'>
            <div className='flex flex-col space-y-2'>
                <h1 className="font-bold text-3xl tracking-tight scroll-m-20">Admin Dashboard</h1>
                <p className="mb-2 text-muted-foreground text-sm md:text-base">
                    Manage your language learning platform and generate dynamic content.
                </p>
            </div>

            <div className='gap-4 grid md:grid-cols-2 lg:grid-cols-4'>
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Total Lessons</CardTitle>
                        <BookOpen className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-primary text-2xl'>
                            0
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">Lessons across all languages</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Active Users</CardTitle>
                        <Users className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-primary text-2xl'>
                            0
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">Users learning languages</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Achievements</CardTitle>
                        <Award className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-primary text-2xl'>
                            0
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">Badges and achievements</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Forum Posts</CardTitle>
                        <MessageSquare className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-primary text-2xl'>
                            0
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">Community discussions</p>
                    </CardContent>
                </Card>
            </div>

            <div className='gap-4 grid md:grid-cols-2 lg:grid-cols-7'>
                <Card className='col-span-4 shadow-sm hover:shadow-md transition-shadow duration-200'>
                    <CardHeader>
                        <CardTitle>Learning Analytics</CardTitle>
                        <CardDescription>User engagement and learning progress over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Analytics charts will be displayed here.</p>
                    </CardContent>
                </Card>
                
                <Card className='col-span-3 shadow-sm hover:shadow-md transition-shadow duration-200'>
                    <CardContent className="p-0">
                        <ContentGenerator />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}