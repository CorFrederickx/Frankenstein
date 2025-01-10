<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs tei"
    version="2.0">
    
    <!-- <xsl:output method="xml" omit-xml-declaration="yes" indent="yes" /> -->

    
    <xsl:template match="tei:TEI">
                     <div class="row">
                         <div class="col">
                             <h4>About the manuscript page:</h4>
                             <p><xsl:value-of select="//tei:sourceDesc"/></p>
                             <p class="lic"><xsl:value-of select="//tei:licence"/></p> <!-- You can change the way the metadata is visualised as well-->
                         </div>
                         <div class="col">
                            <h4> Meta data: </h4>
                            <ul> 
                                <li>Total number of modifications: 
                                    <span><xsl:value-of select="count(//tei:del|//tei:add)" /></span> <!-- Counts all the add and del elements, and puts it in a list item -->
                                </li>
                                <li>Number of corrections by Percy Bysshe Shelley: 
                                    <span><xsl:value-of select="count(//tei:del[@hand = '#PBS']|//tei:add[@hand = '#PBS' ])" /></span>
                                </li>
                                <li>Number of corrections by Mary Shelley: 
                                    <span><xsl:value-of select="count(//tei:del[@hand = '#MWS']|//tei:add[@hand = '#MWS' ])" /></span>
                                </li>
                                <li>Number of words on the manuscript page:
                                    <span><xsl:call-template name="Wordcount"/></span> <!-- calls the wordcount template, see below-->
                                </li>
                            </ul>
                        </div>
                     </div>
        <hr/>
    </xsl:template>
    <xsl:template name="Wordcount"> <!-- counts the numbers of characters, then subtracts length wihtout spaces from this. The resulting number of spaces is a good indication of the number of words.-->
        <xsl:for-each select="tei:text">
            <xsl:value-of select=
                "string-length(normalize-space(.)) 
                -
                string-length(translate(normalize-space(.),' ','')) +1
                "/>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>
